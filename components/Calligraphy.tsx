import clsx from "clsx";
import type { ElementType, ReactNode } from "react";

/**
 * Wraps text in the Pinyon Script calligraphy face.
 * Use sparingly — section names, hero, signatures.
 */
export function Calligraphy({
  children,
  as: Tag = "span",
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}) {
  return <Tag className={clsx("calligraphy", className)}>{children}</Tag>;
}
