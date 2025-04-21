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

import { processIncludes } from "../templating/include.js";
import * as c from "colorette";
import { processDateTimeTags } from "../templating/dateTime.js";
import { processDateDiffTag } from "../templating/dateDiff.js";

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

export async function replaceAll(template, replacements, templateDir = null) {
    let result = template;

    if (templateDir) {
        const { content, included, errors } = await processIncludes(template, templateDir);
        result = content;

        if (included.length > 0) {
            console.log(c.green(`✓ included ${included.length} component(s): `) +
                c.dim(included.map(f => `'${f}'`).join(", ")));
        }

        if (errors.length > 0) {
            console.log(c.yellow(`⚠️ ${errors.length} include error(s):`));
            errors.forEach(err => {
                console.log(c.yellow(`  • '${err.path}': ${err.error}`));
            });
        }
    }

    result = processDateTimeTags(result);
    result = processDateDiffTag(result);

    for (const [tag, value] of Object.entries(replacements)) {
      const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const legacyRegex = new RegExp(`<!--\\s*\\[BLOGGY::${escapedTag}\\s*\\]\\s*-->`, "gi");
      const modernRegex = new RegExp(`{{!\\s*${escapedTag}\\s*}}`, "gi");
      result = result.replace(legacyRegex, value).replace(modernRegex, value);
    }

    return result;
}
