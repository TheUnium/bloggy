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

import { readFile } from "fs/promises";
import { resolve } from "path";
import { existsSync } from "fs";

export async function processIncludes(template, templateDir) {
    const includeRegex = /\{\{!\s*include\s*\(\s*'([^']+)'\s*\)\s*\}\}/g;

    let result = template;
    let match;
    let includesProcessed = [];
    let errors = [];

    while ((match = includeRegex.exec(template)) !== null) {
        const [fullMatch, filePath] = match;
        const fullFilePath = resolve(templateDir, filePath);

        try {
            if (!existsSync(fullFilePath)) {
                throw new Error(`file not found: ${fullFilePath}`);
            }

            const fileContent = await readFile(fullFilePath, "utf8");
            result = result.replace(fullMatch, fileContent);
            includesProcessed.push(filePath);
        } catch (err) {
            errors.push({ path: filePath, error: err.message });
            result = result.replace(
                fullMatch,
                `<!-- ERROR: Failed to include '${filePath}': ${err.message} -->`
            );
        }
    }

    return { content: result, included: includesProcessed, errors };
}