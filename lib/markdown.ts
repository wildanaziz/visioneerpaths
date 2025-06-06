import { compileMDX } from "next-mdx-remote/rsc";
import path from "path";
import { promises as fs } from "fs";
import remarkGfm from "remark-gfm";
import rehypePrism from "rehype-prism-plus";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import rehypeCodeTitles from "rehype-code-titles";
import { page_routes, ROUTES } from "./routes-config";
import { visit } from "unist-util-visit";
import type { Node } from "unist";
import type { Element, ElementContent, Text } from "hast";
import matter from "gray-matter";
import { getIconName, hasSupportedExtension } from "./utils";

// Custom components imports
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Pre from "@/components/markdown/pre";
import Note from "@/components/markdown/note";
import { Stepper, StepperItem } from "@/components/markdown/stepper";
import Image from "@/components/markdown/image";
import Link from "@/components/markdown/link";
import Outlet from "@/components/markdown/outlet";
import Files from "@/components/markdown/files";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { YouTube } from "@/components/youtube";

// Add custom components
const components = {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  pre: Pre,
  Note,
  Stepper,
  StepperItem,
  img: Image,
  a: Link,
  Outlet,
  Files,
  table: Table,
  thead: TableHeader,
  th: TableHead,
  tr: TableRow,
  tbody: TableBody,
  td: TableCell,
  YouTube,
};

// Can be used for other pages like blogs, Guides etc
async function parseMdx<Frontmatter>(rawMdx: string) {
  return await compileMDX<Frontmatter>({
    source: rawMdx,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        rehypePlugins: [
          preProcess,
          rehypeCodeTitles,
          rehypeCodeTitlesWithLogo,
          rehypePrism,
          rehypeSlug,
          rehypeAutolinkHeadings,
          postProcess,
        ],
        remarkPlugins: [remarkGfm],
      },
    },
    components,
  });
}

// Logic for docs
export type BaseMdxFrontmatter = {
  title: string;
  description: string;
};

export async function getCompiledDocsForSlug(slug: string) {
  try {
    const contentPath = getDocsContentPath(slug);
    const rawMdx = await fs.readFile(contentPath, "utf-8");
    return await parseMdx<BaseMdxFrontmatter>(rawMdx);
  } catch (err) {
    console.log(err);
  }
}

export async function getDocsTocs(slug: string) {
  const contentPath = getDocsContentPath(slug);
  const rawMdx = await fs.readFile(contentPath, "utf-8");
  const headingsRegex = /^(#{2,4})\s(.+)$/gm;
  let match;
  const extractedHeadings = [];
  while ((match = headingsRegex.exec(rawMdx)) !== null) {
    const headingLevel = match[1].length;
    const headingText = match[2].trim();
    const slug = sluggify(headingText);
    extractedHeadings.push({
      level: headingLevel,
      text: headingText,
      href: `#${slug}`,
    });
  }
  return extractedHeadings;
}

export function getPreviousNext(path: string) {
  const index = page_routes.findIndex(({ href }) => href === `/${path}`);
  return {
    prev: page_routes[index - 1],
    next: page_routes[index + 1],
  };
}

function sluggify(text: string) {
  const slug = text.toLowerCase().replace(/\s+/g, "-");
  return slug.replace(/[^a-z0-9-]/g, "");
}

function getDocsContentPath(slug: string) {
  return path.join(process.cwd(), "/contents/docs/", `${slug}/index.mdx`);
}

function justGetFrontmatterFromMD<Frontmatter>(rawMd: string): Frontmatter {
  return matter(rawMd).data as Frontmatter;
}

export async function getAllChilds(pathString: string) {
  const items = pathString.split("/").filter((it: string) => it !== "");
  let page_routes_copy = ROUTES;

  let prevHref = "";
  for (const it of items) {
    const found = page_routes_copy.find((innerIt) => innerIt.href === `/${it}`);
    if (!found) break;
    prevHref += found.href;
    page_routes_copy = found.items ?? [];
  }
  if (!prevHref) return [];

  return await Promise.all(
    page_routes_copy.map(async (it: { href: string }) => {
      const totalPath = path.join(
        process.cwd(),
        "/contents/docs/",
        prevHref,
        it.href,
        "index.mdx"
      );
      const raw = await fs.readFile(totalPath, "utf-8");
      return {
        ...justGetFrontmatterFromMD<BaseMdxFrontmatter>(raw),
        href: `/docs${prevHref}${it.href}`,
      };
    })
  );
}

// Define custom interface for nodes with additional properties
interface CustomElement extends Element {
  raw?: string;
  properties: Record<string, string | string[]>;
  children: ElementContent[];
}

const preProcess = () => (tree: Node) => {
  visit(tree, "element", (node: CustomElement) => {
    if (node.type === "element" && node.tagName === "pre") {
      const [codeEl] = node.children as CustomElement[];
      if (codeEl.tagName !== "code") return;
      const firstChild = codeEl.children?.[0] as Text;
      node.raw = firstChild?.value ?? "";
    }
  });
};

const postProcess = () => (tree: Node) => {
  visit(tree, "element", (node: CustomElement) => {
    if (node.type === "element" && node.tagName === "pre") {
      node.properties["raw"] = node.raw ?? "";
    }
  });
};

export type Author = {
  avatar?: string;
  handle: string;
  username: string;
  handleUrl: string;
};

export type BlogMdxFrontmatter = BaseMdxFrontmatter & {
  date: string;
  authors: Author[];
  cover: string;
  youtube?: string;
};

export async function getAllBlogStaticPaths() {
  try {
    const blogFolder = path.join(process.cwd(), "/contents/week/");
    const res = await fs.readdir(blogFolder);
    return res.map((file: string) => file.split(".")[0]);
  } catch (err) {
    console.log(err);
  }
}

export async function getAllBlogsFrontmatter() {
  const blogFolder = path.join(process.cwd(), "/contents/week/");
  const files = await fs.readdir(blogFolder);
  const uncheckedRes = await Promise.all(
    files.map(async (file: string) => {
      if (!file.endsWith(".mdx")) return undefined;
      const filepath = path.join(process.cwd(), `/contents/week/${file}`);
      const rawMdx = await fs.readFile(filepath, "utf-8");
      return {
        ...justGetFrontmatterFromMD<BlogMdxFrontmatter>(rawMdx),
        slug: file.split(".")[0],
      };
    })
  );
  return uncheckedRes.filter((it): it is NonNullable<typeof it> => !!it) as (BlogMdxFrontmatter & {
    slug: string;
  })[];
}

export async function getCompiledBlogForSlug(slug: string) {
  const blogFile = path.join(process.cwd(), "/contents/week/", `${slug}.mdx`);
  try {
    const rawMdx = await fs.readFile(blogFile, "utf-8");
    return await parseMdx<BlogMdxFrontmatter>(rawMdx);
  } catch {
    return undefined;
  }
}

export async function getBlogFrontmatter(slug: string) {
  const blogFile = path.join(process.cwd(), "/contents/week/", `${slug}.mdx`);
  try {
    const rawMdx = await fs.readFile(blogFile, "utf-8");
    return justGetFrontmatterFromMD<BlogMdxFrontmatter>(rawMdx);
  } catch {
    return undefined;
  }
}

export async function getDocFrontmatter(path: string) {
  try {
    const contentPath = getDocsContentPath(path);
    const rawMdx = await fs.readFile(contentPath, "utf-8");
    return justGetFrontmatterFromMD<BlogMdxFrontmatter>(rawMdx);
  } catch {
    return undefined;
  }
}

function rehypeCodeTitlesWithLogo() {
  return (tree: Node) => {
    visit(tree, "element", (node: CustomElement) => {
      if (
        node.type === "element" &&
        node.properties?.className?.includes("rehype-code-title")
      ) {
        const titleTextNode = node.children.find(
          (child) => child.type === "text"
        ) as Text;
        if (!titleTextNode) return;

        const titleText = titleTextNode.value ?? "";
        const match = hasSupportedExtension(titleText);
        if (!match) return;

        const splittedNames = titleText.split(".");
        const ext = splittedNames[splittedNames.length - 1];
        const iconClass = `devicon-${getIconName(ext)}-plain text-[17px]`;

        if (iconClass) {
          const newElement: CustomElement = {
            type: "element",
            tagName: "i",
            properties: { className: [iconClass, "code-icon"] },
            children: [],
          };
          node.children.unshift(newElement);
        }
      }
    });
  };
}