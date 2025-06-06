import { PropsWithChildren } from "react";

export default function TeamLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col items-center justify-center pt-12 pb-16 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}