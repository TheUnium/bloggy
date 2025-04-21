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

export function processDateDiffTag(template) {
  const now = new Date();
  const timestamp = now.getTime();
  const dateDiffRegex = /\{\{!\s*date_diff\s*\}\}/g;
  return template.replace(dateDiffRegex, () => {
    return `<script>
        !function(){const o=${timestamp};!function(){const t=function(){const t=(new Date).getTime()-o,n=Math.floor(t/1e3);if(n<60)return"just now";if(n<3600){const o=Math.floor(n/60);return 1===o?"1 minute ago":o+" minutes ago"}if(n<86400){const o=Math.floor(n/3600);return 1===o?"1 hour ago":o+" hours ago"}if(n<2592e3){const o=Math.floor(n/86400);return 1===o?"1 day ago":o+" days ago"}if(n<31536e3){const o=Math.floor(n/2592e3);return 1===o?"1 month ago":o+" months ago"}const r=Math.floor(n/31536e3);return 1===r?"1 year ago":r+" years ago"}();document.write(t)}()}();
    </script>`;
  });
}