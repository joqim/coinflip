const BASE_URL = "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/32/color";
export const GENERIC_ICON_URL = `${BASE_URL}/generic.png`;

/**
 * Loads the icon for a given cryptocurrency symbol. If the icon is not found
 * or there's an error fetching it, the generic icon URL is returned instead.
 *
 * @param {string} symbol - The symbol of the cryptocurrency to load the icon for
 * @returns {Promise<string>} - The URL of the icon, or the generic icon URL
 */
export const loadIcon = async (symbol: string): Promise<string> => {
  const formattedSymbol = symbol.toLowerCase();
  
  try {
    const response = await fetch(`${BASE_URL}/${formattedSymbol}.png`);
    if (!response.ok) {
      console.warn(`Icon for ${symbol} not found, falling back to generic icon.`);
      return GENERIC_ICON_URL;
    }
    return response.url;
  } catch (error) {
    console.error(`Error fetching icon for ${symbol}:`, error);
    return GENERIC_ICON_URL;
  }
};


/**
 * Formats a given timestamp into a human-readable date string.
 * The format is "Dth M 'YY", where:
 * - "Dth" is the day of the month with the appropriate ordinal suffix (e.g., 1st, 2nd, 3rd, 4th).
 * - "M" is the abbreviated month name (e.g., Jan, Feb, Mar).
 * - "'YY" is the last two digits of the year.
 *
 * @param {number} dateValue - The timestamp in milliseconds since the Unix epoch.
 * @returns {string} - The formatted date string.
 */

export function formatDate(dateValue: number): string {
  const date = new Date(dateValue);
  const day = date.getDate();
  const suffix =
    day === 1 || day === 21 || day === 31 ? 'st' :
    day === 2 || day === 22 ? 'nd' :
    day === 3 || day === 23 ? 'rd' : 'th';
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear().toString().slice(-2);

  return `${day}${suffix} ${month} '${year}`;
}
