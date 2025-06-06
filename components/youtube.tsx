import { FC } from "react";

interface YouTubeProps {
  videoId: string;
  title?: string;
  description?: string;
  className?: string;
}

export const YouTube: FC<YouTubeProps> = ({ videoId, title = "YouTube Video", description = "", className = "w-full h-[400px] rounded-md border" }) => {
  return (
    <div className="w-full my-4">
      <iframe
        className={className}
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      {(title || description) && (
        <div className="mt-2">
          {title && <p className="text-sm font-medium">{title}</p>}
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      )}
    </div>
  );
};