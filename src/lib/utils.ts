/**
 * Utility functions for class names and formatting
 */

export function clsx(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
