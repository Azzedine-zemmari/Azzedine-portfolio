import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

/**
 * Theme switch. Icons are swapped with CSS visibility so the correct one
 * paints immediately from the pre-paint `data-theme` value (no hydration
 * mismatch, no wrong-icon flash).
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const label =
    theme === "light" ? "Switch to dark theme" : "Switch to light theme";

  return (
    <button
      type="button"
      onClick={toggle}
      className={`btn btn-ghost px-2 ${className}`}
      aria-label={label}
      title={label}
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Sun className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}
