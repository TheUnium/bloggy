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

import {readFile} from "fs/promises";
import { fileURLToPath } from "url";
import { resolve, dirname } from "path";
import yaml from "yaml";
import * as c from "colorette";

const __filename = fileURLToPath(import.meta.url);
const SCRIPT_DIR = dirname(__filename);

export let CONFIG = {
    post: {
        title: "Unnamed Post",
        description: "No description provided... so sad... ⏳⏳⏳",
        color: "#72d572"
    },
    paths: {
        template: resolve(SCRIPT_DIR, "templates/template.html"),
        output_dir: resolve(SCRIPT_DIR, "dist")
    },
    rules: {
        allowRawHtml: false,
        maxParagraphLength: 500,
        requireImageAlts: true,
        allowConsecutiveHeaders: false,
        maxHeaderDepth: 4,
        requireListSpacing: true,
        requireTableSeparators: true
    },
    validation: {
        enabled: true,
        errors: true,
        warns: true
    }
};

function getConfigPath() {
    return resolve(process.cwd(), "config.yaml");
}

export async function loadConfig() {
    const configPath = getConfigPath();
    try {
        const yamlContent = await readFile(configPath, "utf8");
        const parsed = yaml.parse(yamlContent);
        CONFIG = {
            post: {
                ...CONFIG.post,
                ...(parsed.post || {})
            },
            paths: {
                ...CONFIG.paths,
                ...(parsed.paths || {})
            },
            rules: {
                ...CONFIG.rules,
                ...(parsed.rules || {})
            },
            validation: {
                ...CONFIG.validation,
                ...(parsed.validation || {})
            }
        };
    } catch (err) {
        console.warn(c.yellow(`⚠️ couldn't load config.yaml from ${configPath} — using fallback defaults`));
    }
}
