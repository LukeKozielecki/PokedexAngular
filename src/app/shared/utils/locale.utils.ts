/**
 * Determines the current locale based on the document's pathname.
 * @param pathname The pathname of the current URL.
 * @returns The current locale ('en-US' or 'es'), or null if neither is found.
 */
export function getCurrentLocale(pathname: string): string {
  console.log(pathname)
  if (pathname.startsWith('/en-US')) {
    return 'en-US';
  } else if (pathname.startsWith('/es')) {
    return 'es';
  }
  return "en";
}

/**
 * Generates a new URL path with the specified language.
 * @param currentPath The current URL path.
 * @param lang The language to switch to ('en-US' or 'es').
 * @returns The new path with the updated language prefix.
 */
export function getNewLanguagePath(currentPath: string, lang: string): string {
  if (currentPath.startsWith('/es') || currentPath.startsWith('/en-US')) {
    return `/${lang}${currentPath.substring(currentPath.indexOf('/', 1))}`;
  } else {
    return `/${lang}${currentPath}`;
  }
}
