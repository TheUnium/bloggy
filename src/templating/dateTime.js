/*!
 * Copyright (c) 2025 unium
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
 * NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

function formatDate(date, format = 'DD-MM-YYYY') {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return format
    .replace(/YYYY/g, year)
    .replace(/YY/g, String(year).slice(-2))
    .replace(/MM/g, month)
    .replace(/DD/g, day)
    .replace(/M/g, String(date.getMonth() + 1))
    .replace(/D/g, String(date.getDate()));
}

function formatTime(date, format = '24h') {
  const hours24 = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  if (format === '12h') {
    const period = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 || 12;
    return `${hours12}:${minutes}:${seconds} ${period}`;
  }

  if (format === '24h') {
    return `${String(hours24).padStart(2, '0')}:${minutes}:${seconds}`;
  }

  return format
    .replace(/HH/g, String(hours24).padStart(2, '0'))
    .replace(/H/g, String(hours24))
    .replace(/hh/g, String(hours24 % 12 || 12).padStart(2, '0'))
    .replace(/h/g, String(hours24 % 12 || 12))
    .replace(/mm/g, minutes)
    .replace(/m/g, String(date.getMinutes()))
    .replace(/ss/g, seconds)
    .replace(/s/g, String(date.getSeconds()))
    .replace(/a/g, hours24 >= 12 ? 'pm' : 'am')
    .replace(/A/g, hours24 >= 12 ? 'PM' : 'AM');
}

export function processDateTimeTags(template) {
  const now = new Date();

  const dateRegex = /\{\{!\s*date(?:\s*\(\s*'([^']*)'\s*\))?\s*\}\}/g;
  template = template.replace(dateRegex, (match, format) => {
    return format ? formatDate(now, format) : formatDate(now);
  });

  const timeRegex = /\{\{!\s*time(?:\s*\(\s*'([^']*)'\s*\))?\s*\}\}/g;
  template = template.replace(timeRegex, (match, format) => {
    return format ? formatTime(now, format) : formatTime(now);
  });

  return template;
}

export function getDefaultDateTimeValues() {
  const now = new Date();
  return {
    DATE: formatDate(now),
    date: formatDate(now),
    TIME: formatTime(now),
    time: formatTime(now)
  };
}