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

import { VERSION } from "./version.js";
import { setupWatcher } from "./watcher.js";
import { CONFIG, loadConfig, validateMarkdown, printValidationResults, parseFrontmatter, replaceAll } from "./utils/index.js";
import { getTemplateValues } from "./templating/index.js";
import { printHelp, printVersion } from "./display.js";
import { initProject } from "./utils/init.js";


async function bloggy(inputPath, options = {}) {
    const {
        isWatchMode = false,
        skipValidation = false,
        showErrors = CONFIG.validation.errors,
        showWarns = CONFIG.validation.warns
    } = options;

    const fullPath = resolve(inputPath);

    if (!fullPath.endsWith(".md")) {
        console.error(c.red(`grrrr gimme md file (like .md files ykyk)\n${c.dim("try --help or -h to view the help message, if you aren't sure on what to do")}`));
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
            const templateVars = getTemplateValues({
                TITLE: title,
                title,
                DESCRIPTION: description,
                description,
                COLOR: color,
                color,
                CONTENT: htmlContent,
                content: htmlContent
            });

            const finalHTML = await replaceAll(template, templateVars, CONFIG.paths.template_dir);

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
const serverMode = args.includes("--server") || args.includes("-s");
const noServer = args.includes("--no-server");
const portIndex = args.indexOf("--port");
const serverPort = portIndex !== -1 ? parseInt(args[portIndex + 1], 10) || 3000 : 3000;

const skipValidation = args.includes("--no-validate");
const showErrors = !args.includes("--no-errors");
const showWarns = !args.includes("--no-warns");

if (!inputPath) {
    console.error(`${c.red(`erm where the sigma is file 😔\n`)}${c.dim("try --help or -h to view the help message, if you aren't sure on what to do")}`);
    process.exit(1);
}

if (watchMode || serverMode) {
    console.log(c.blueBright(`👀 watching for changes to ${inputPath}...`));

    await loadConfig();
    await setupWatcher(inputPath, {
        skipValidation,
        showErrors,
        showWarns,
        enableServer: serverMode || (watchMode && !noServer),
        serverPort
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