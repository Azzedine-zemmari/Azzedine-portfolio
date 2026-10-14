import { techIcons } from "./techIcons";

export function TechIcon({
  name,
  className = "h-8 w-8",
}: {
  name: string;
  className?: string;
}) {
  const svg = techIcons[name];
  if (!svg) return null;
  return (
    <span
      className={className}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
