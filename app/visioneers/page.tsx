import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Globe, Instagram, Github } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

// Define team member interface
interface TeamMember {
  name: string;
  role: string;
  roleDescription: string;
  avatar: string;
  website?: string;
  instagram?: string;
  github?: string;
}

// Sample team data (replace with actual team data)
const teamMembers: TeamMember[] = [
  {
    name: "Wildan Aziz",
    role: "PIC Programming Vision Amarine",
    roleDescription: "Responsible for the programming aspects of Vision Amarine which is develop vision staff team through the Weeks program. Maintain Website visioneer, TL-Vision Repository, and helping core team to develop submarine vision robot project.",
    avatar: "https://avatars.githubusercontent.com/u/87745598?v=4",
    website: "https://wildanaziz.vercel.app",
    instagram: "https://instagram.com/wildannaziz",
    github: "https://github.com/wildanaziz",
  },
  {
    name: "Naufal Bhanu",
    role: "Core Team Project Vision Amarine",
    roleDescription: "Leads the core team for Vision Amarine, overseeing project development and team coordination for the submarine vision robot project.",
    avatar: "/images/jane-smith.jpg",
    instagram: "https://instagram.com/naufal.bhanu",
    github: "https://github.com/nbhan21",
  },
  // Add more team members as needed
];

export const metadata: Metadata = {
  title: "Visioner Team",
};

export default function TeamPage() {
  return (
    <div className="flex flex-col gap-1 sm:min-h-[91vh] min-h-[88vh] pt-2">
      <div className="mb-7 flex flex-col gap-2">
        <h1 className="sm:text-3xl text-2xl font-extrabold">
          Meet the Visioneer Team
        </h1>
        <p className="text-muted-foreground sm:text-[16.5px] text-[14.5px]">
          The talented individuals behind Vision Amarine
        </p>
      </div>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-8 gap-4 mb-5">
        {teamMembers.map((member) => (
          <TeamCard key={member.name} {...member} />
        ))}
      </div>
    </div>
  );
}

function TeamCard({ name, role, roleDescription, avatar, website, instagram, github }: TeamMember) {
  return (
    <div className="flex flex-col gap-4 items-center border rounded-md py-5 px-3 min-h-[400px]">
      <Avatar className="w-24 h-24">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback>
          {name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="text-center">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm font-semibold text-blue-400">{role}</p>
        <p className="text-sm text-muted-foreground mt-1">{roleDescription}</p>
      </div>
      <div className="flex gap-4 mt-auto">
        {website && (
          <Link
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 transition-colors"
            aria-label="Personal website"
          >
            <Globe className="w-5 h-5" />
          </Link>
        )}
        {instagram && (
          <Link
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 transition-colors"
            aria-label="Instagram profile"
          >
            <Instagram className="w-5 h-5" />
          </Link>
        )}
        {github && (
          <Link
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 transition-colors"
            aria-label="GitHub profile"
          >
            <Github className="w-5 h-5" />
          </Link>
        )}
      </div>
    </div>
  );
}