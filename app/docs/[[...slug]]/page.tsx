import DocsBreadcrumb from "@/components/docs-breadcrumb";
import Pagination from "@/components/pagination";
import { Suspense } from "react";
import Toc from "@/components/toc";
import { page_routes } from "@/lib/routes-config";
import { notFound } from "next/navigation";
import { getCompiledDocsForSlug, getDocFrontmatter, getDocsTocs } from "@/lib/markdown";
import { Typography } from "@/components/typography";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function DocsPage(props: PageProps) {
  const params = await props.params;
  const { slug = [] } = params;

  const pathName = slug.join("/");
  const res = await getCompiledDocsForSlug(pathName);
  if (!res) notFound();

  // Ambil data TOC di server-side
  const tocs = await getDocsTocs(pathName);

  return (
    <div className="flex items-start gap-10">
      <div className="flex-[4.5] py-10 mx-auto max-w-4xl">
        <div className="w-full mx-auto">
          <DocsBreadcrumb paths={slug} />
          <Typography>
            <h1 className="sm:text-3xl text-2xl !-mt-0.5 font-bold">
              {res.frontmatter.title}
            </h1>
            <p className="-mt-4 text-muted-foreground sm:text-[16.5px] text-[14.5px]">
              {res.frontmatter.description || "No description available"}
            </p>
            <div className="prose dark:prose-invert mt-6">{res.content}</div>
            <Pagination pathname={pathName} />
          </Typography>
        </div>
      </div>

      <Suspense fallback={<div className="w-[20rem] p-4">Loading TOC...</div>}>
        <Toc tocs={tocs} /> {/* Hapus props path */}
      </Suspense>
    </div>
  );
}

export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  const { slug = [] } = params;

  const pathName = slug.join("/");
  const res = await getDocFrontmatter(pathName);
  if (!res) return { title: "Not Found", description: "Page not found" };
  const { title, description } = res;
  return {
    title: title || "Untitled Page",
    description: description || "No description available",
  };
}

export function generateStaticParams() {
  return page_routes.map((item) => ({
    slug: item.href.split("/").slice(1),
  }));
}