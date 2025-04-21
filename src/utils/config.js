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

import {readFile, writeFile} from "fs/promises";
import { fileURLToPath } from "url";
import { resolve, dirname } from "path";
import yaml from "yaml";
import * as c from "colorette";
import { VERSION } from "../version.js";
import { DEFAULT_CONFIG_TEMPLATE } from "../defaults/config.js";
import { parse } from "yaml";

const __filename = fileURLToPath(import.meta.url);
const SCRIPT_DIR = dirname(__filename);
const DEFAULT_TEMPLATE_DIR = resolve(dirname(SCRIPT_DIR), "templates");

export let CONFIG = {
    bloggy: {
        version: VERSION
    },
    post: {
        title: "Unnamed Post",
        description: "No description provided... so sad... ⏳⏳⏳",
        color: "#72d572"
    },
    paths: {
        template: resolve(SCRIPT_DIR, "templates/template.html"),
        template_dir: DEFAULT_TEMPLATE_DIR,
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

function mergeWithDefaults(userConfig, defaultConfig) {
    const merged = {};

    for (const [key, defaultValue] of Object.entries(defaultConfig)) {
        if (key === 'bloggy') {
            merged[key] = { version: VERSION };
            continue;
        }

        if (!userConfig[key] || typeof defaultValue !== 'object' || Array.isArray(defaultValue)) {
            merged[key] = defaultValue;
            continue;
        }

        if (typeof defaultValue === 'object') {
            merged[key] = {};
            for (const [subKey, subValue] of Object.entries(defaultValue)) {
                merged[key][subKey] = userConfig[key][subKey] !== undefined ?
                    userConfig[key][subKey] : subValue;
            }

            for (const [subKey, subValue] of Object.entries(userConfig[key])) {
                if (merged[key][subKey] === undefined) {
                    merged[key][subKey] = subValue;
                }
            }
        }
    }

    for (const [key, value] of Object.entries(userConfig)) {
        if (merged[key] === undefined) {
            merged[key] = value;
        }
    }

    return merged;
}

function needsUpdate(userConfig) {
    return !userConfig.bloggy ||
           !userConfig.bloggy.version ||
           userConfig.bloggy.version !== VERSION;
}

async function updateConfigFile(configPath, mergedConfig) {
    try {
        const updatedYaml = yaml.stringify(mergedConfig);
        await writeFile(configPath, updatedYaml, "utf8");
        return true;
    } catch (err) {
        console.error(c.red(`Failed to update config file: ${err.message}`));
        return false;
    }
}

export async function loadConfig() {
    const configPath = getConfigPath();
    try {
        const yamlContent = await readFile(configPath, "utf8");
        const userConfig = yaml.parse(yamlContent);
        if (needsUpdate(userConfig)) {
            const defaultConfigObj = parse(DEFAULT_CONFIG_TEMPLATE
                .replace("{template_path}", CONFIG.paths.template)
                .replace("{template_dir}", CONFIG.paths.template_dir)
                .replace("{output_dir}", CONFIG.paths.output_dir));

            defaultConfigObj.bloggy = { version: VERSION };
            const mergedConfig = mergeWithDefaults(userConfig, defaultConfigObj);
            const updated = await updateConfigFile(configPath, mergedConfig);

            if (updated) {
                const oldVersion = userConfig.bloggy?.version || "unknown";
                if (oldVersion !== "unknown") {
                    console.log(c.cyan(`📝 config updated from v${oldVersion} to v${VERSION}`));
                } else {
                    console.log(c.cyan(`📝 config updated to v${VERSION}`));
                }
                console.log(c.dim(`   check what's new: https://github.com/TheUnium/bloggy/releases/tag/${VERSION}`));

                CONFIG = mergedConfig;
            } else {
                CONFIG = {
                    ...CONFIG,
                    ...userConfig,
                    bloggy: { version: VERSION }
                };
            }
        } else {
            CONFIG = {
                ...CONFIG,
                ...userConfig
            };
        }

        if (!CONFIG.paths.template_dir) {
            CONFIG.paths.template_dir = dirname(CONFIG.paths.template);
        }
    } catch (err) {
        console.warn(c.yellow(`⚠️ couldn't load config.yaml from ${configPath} — using fallback defaults`));
    }
}