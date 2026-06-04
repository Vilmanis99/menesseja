/** Minimal classNames joiner — drops falsy values. */
export function clsx(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(" ");
}
