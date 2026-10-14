import { useCallback } from "react";
import type { ReactNode } from "react";

/**
 * Turns a plain, translator-authored string into React nodes:
 *   *word*  → emphasised serif word in the accent colour
 *   `code`  → inline code that stays left-to-right even under RTL
 *
 * The emphasis lives in the string (not the JSX) so translators are free to
 * place it anywhere in a sentence. The returned function is stable.
 */
export function useRich(): (text: string) => ReactNode {
  const rich = useCallback((text: string): ReactNode => {
    const tokens = text.split(/(\*[^*]+\*|`[^`]+`)/g).filter(Boolean);
    return tokens.map((token, i) => {
      if (token.length > 2 && token.startsWith("*") && token.endsWith("*")) {
        return (
          <span key={i} className="display-italic text-neon">
            {token.slice(1, -1)}
          </span>
        );
      }
      if (token.length > 2 && token.startsWith("`") && token.endsWith("`")) {
        return (
          <code key={i} className="force-ltr">
            {token.slice(1, -1)}
          </code>
        );
      }
      return token;
    });
  }, []);

  return rich;
}
