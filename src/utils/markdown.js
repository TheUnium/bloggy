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

import * as c from "colorette";

export function validateMarkdown(content, rules) {
    const errors = [];
    const warnings = [];

    const brokenLinkRegex = /\[([^\]]+)]\(\s*\)/g;
    let match;
    while ((match = brokenLinkRegex.exec(content)) !== null) {
        errors.push(`empty link target for "[${match[1]}]()". this is missing a url!`);
    }

    if (!rules.allowConsecutiveHeaders) {
        const consecutiveHeaders = content.match(/#{1,6} .+\n#{1,6} .+/g);
        if (consecutiveHeaders) {
            warnings.push(`found ${consecutiveHeaders.length} consecutive headers without content between them.`);
        }
    }

    if (rules.maxHeaderDepth < 6) {
        const headerRegex = new RegExp(`#{${rules.maxHeaderDepth + 1},6} `, 'g');
        if (content.match(headerRegex)) {
            warnings.push(`using headers deeper than h${rules.maxHeaderDepth}, please restructure your md...`);
        }
    }

    const longParagraphs = content.split("\n\n").filter(p => p.length > rules.maxParagraphLength);
    if (longParagraphs.length > 0) {
        warnings.push(`found ${longParagraphs.length} very, VERY long paragraphs (>${rules.maxParagraphLength} chars). consider breaking them up lol`);
    }

    if (!rules.allowRawHtml) {
        const htmlTags = content.match(/<(?!code|pre|kbd|br|hr)[a-z]+[^>]*>/gi);
        if (htmlTags && htmlTags.length > 0) {
            warnings.push(`found raw html tags in markdown: ${htmlTags.slice(0, 3).join(", ")}${htmlTags.length > 3 ? "..." : ""}`);
        }
    }

    if (rules.requireImageAlts) {
        const imagesWithoutAlt = content.match(/!\[\s*]\([^)]+\)/g);
        if (imagesWithoutAlt && imagesWithoutAlt.length > 0) {
            warnings.push(`found ${imagesWithoutAlt.length} images without alt text. this is important for accessibility!`);
        }
    }

    if (rules.requireListSpacing) {
        const listItems = content.match(/^([-*+]|\d+\.)\s+.+/gm) || [];
        const standaloneLists = content.match(/^([-*+]|\d+\.)\s+.+\n\n/gm) || [];
        if (listItems.length > 0 && standaloneLists.length === listItems.length) {
            warnings.push("list items appear to be separated by blank lines. this will break list formatting...");
        }
    }

    if (rules.requireTableSeparators) {
        const tableRows = content.match(/\|[^|]+\|/g) || [];
        const tableSeparators = content.match(/\|[\s-:]+\|/g) || [];
        if (tableRows.length > 0 && tableSeparators.length === 0) {
            errors.push("table appears to be malformed, missing separator row with dashes.");
        }
    }

    return { errors, warnings };
}

export function printValidationResults(errors, warnings, showErrors = true, showWarns = true) {
    if (errors.length > 0 && showErrors) {
        console.log(c.red(c.bold("⛔ stuff wrong:")));
        errors.forEach(error => {
            console.log(c.red(`  • ${error}`));
        });
    }

    if (warnings.length > 0 && showWarns) {
        console.log(c.yellow(c.bold("⚠️ bad practice:")));
        warnings.forEach(warning => {
            console.log(c.yellow(`  • ${warning}`));
        });
    }

    if ((errors.length > 0 && showErrors) || (warnings.length > 0 && showWarns)) {
        console.log(`
${c.bold("Notes:")}
  ${c.bold(c.cyan("📝 bloggy"))} will still convert this to html, just some things will likely be broken.
  ${c.dim(`you can disable this with ${c.bold('--no-warns')} and ${c.bold('--no-errors')}, or just ${c.bold('--no-validate')} to disable both.`)}
  ${c.dim(`you can also do this same thing in the ${c.bold('config.yaml')} file if you want, itll do the same thing`)}
`);
        console.log(c.dim("---------------------"));
    }
}
