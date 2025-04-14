#!/usr/bin/env node

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

import { readFile, writeFile } from "fs/promises";
import { resolve, basename } from "path";
import { marked } from "marked";
import * as c from "colorette";
import { existsSync, mkdirSync } from "fs";

import { setupWatcher } from "./watcher.js";
import { CONFIG, loadConfig, validateMarkdown, printValidationResults, parseFrontmatter, replaceAll, initProject } from "./utils/index.js";
import { printHelp, printVersion } from "./display.js";

const VERSION = "1.1.0";


async function bloggy(inputPath, options = {}) {
    const {
        isWatchMode = false,
        skipValidation = false,
        showErrors = CONFIG.validation.errors,
        showWarns = CONFIG.validation.warns
    } = options;

    const fullPath = resolve(inputPath);

    if (!fullPath.endsWith(".md")) {
        console.error(c.red("grrrr gimme md file (like .md files ykyk)"));
        process.exit(1);
    }

    try {
        const mdContent = await readFile(fullPath, "utf8");
        const { attributes, body } = parseFrontmatter(mdContent);
        const { errors, warnings } = validateMarkdown(body, CONFIG.rules);

        if (!skipValidation && CONFIG.validation.enabled) {
            printValidationResults(errors, warnings, showErrors, showWarns);
        }

        const title = attributes.title || CONFIG.post.title;
        const description = attributes.description || CONFIG.post.description;
        const color = attributes.color || CONFIG.post.color;
        const htmlContent = marked(body);

        const templatePath = CONFIG.paths.template;
        try {
            const template = await readFile(templatePath, "utf8");

            const now = new Date();
            const date = now.toISOString().split("T")[0];
            const time = now.toTimeString().split(" ")[0];

            const finalHTML = replaceAll(template, {
                TITLE: title,
                DESCRIPTION: description,
                COLOR: color,
                CONTENT: htmlContent,
                DATE: date,
                TIME: time
            });

            const fileName = basename(fullPath, ".md");
            const outputDir = CONFIG.paths.output_dir;

            if (!existsSync(outputDir)) {
                mkdirSync(outputDir, { recursive: true });
                console.log(`${c.green("✓")} created output directory: ${c.dim(outputDir)}`);
            }

            const outputPath = resolve(outputDir, `${fileName}.html`);
            await writeFile(outputPath, finalHTML, "utf8");

            if (isWatchMode) {
                console.log(c.green("✓") + " " + c.dim(outputPath));
            } else {
                console.log(c.bold(c.green("📝 maked: ")) + c.bold(`${fileName}.html `) + c.dim(`(${c.red(`⛔ ${errors.length}`)} | ${c.yellow(`⚠${warnings.length}`)})`));
                console.log(c.dim('---------------------'))
                console.log(c.cyan("📝 title: ") + title);
                console.log(c.cyan("📎 desc: ") + description);
                console.log(c.cyan("📂 saved to: ") + outputPath);
            }
        } catch (err) {
            console.error(c.red(`template error: ${err.message}`));
            console.error(c.dim(`looking for template at: ${templatePath}`));
            process.exit(1);
        }
    } catch (err) {
        console.error(c.red(`i womped...\n---\n${err.message}\n---`));
        process.exit(1);
    }
}

export { bloggy, loadConfig };

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
    printHelp(VERSION);
    process.exit(0);
}

if (args.includes("--version") || args.includes("-v")) {
    printVersion(VERSION);
    process.exit(0);
}

if (args.includes("--init") || args.includes("-i")) {
    const initIndex = args.indexOf("--init") !== -1 ? args.indexOf("--init") : args.indexOf("-i");
    const projectDir = args[initIndex + 1] || ".";
    await initProject(projectDir);
    process.exit(0);
}

const inputPath = args.find(arg => arg.endsWith(".md"));
const watchMode = args.includes("--watch") || args.includes("-w");
const skipValidation = args.includes("--no-validate");
const showErrors = !args.includes("--no-errors");
const showWarns = !args.includes("--no-warns");

if (!inputPath) {
    console.error(c.red("erm where the sigma is file 😔"));
    process.exit(1);
}

if (watchMode) {
    console.log(c.blueBright(`👀 watching for changes to ${inputPath}...`));

    await loadConfig();
    await setupWatcher(inputPath, {
        skipValidation,
        showErrors,
        showWarns
    });
} else {
    await loadConfig();
    await bloggy(inputPath, {
        isWatchMode: watchMode,
        skipValidation,
        showErrors,
        showWarns
    });
}