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

export function parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]+?)\n---\n/);
    if (!match) return { attributes: {}, body: content };

    const lines = match[1].split("\n");
    const attributes = {};

    for (const line of lines) {
        const [key, ...rest] = line.split(":");
        if (key && rest.length) {
            attributes[key.trim()] = rest.join(":").trim();
        }
    }

    return { attributes, body: content.slice(match[0].length) };
}

export function replaceAll(template, replacements) {
    let result = template;
    for (const [tag, value] of Object.entries(replacements)) {
        const regex = new RegExp(`<!--\\s*\\[BLOGGY::${tag}\\]\\s*-->`, "g");
        result = result.replace(regex, value);
    }
    return result;
}