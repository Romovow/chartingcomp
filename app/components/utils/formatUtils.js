// formatUtils.js

/**
 * Format a date based on the provided format string.
 * @param {Date} date - The date object to format.
 * @param {string} format - The format string specifying how to format the date.
 * @returns {string} The formatted date string.
 */
export function formatDate(date, format) {
    const pad = (num) => num.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = date.getDate();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
  
    const getOrdinalNum = (n) => {
      let s = ["th", "st", "nd", "rd"],
        v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };
  
    return format
      .replace('yyyy', year)
      .replace('MM', month)
      .replace('dd', getOrdinalNum(day))
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }
  