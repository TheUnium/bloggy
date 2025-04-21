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

import { writeFile } from "fs/promises";
import { resolve, dirname } from "path";
import { existsSync, mkdirSync } from "fs";
import * as c from "colorette";

import { VERSION } from "../version.js";
import { DEFAULT_CONFIG_TEMPLATE, DEFAULT_MARKDOWN_TEMPLATE, DEFAULT_HTML_TEMPLATE, DEFAULT_HEADER_TEMPLATE, DEFAULT_FOOTER_TEMPLATE, DEFAULT_CSS_TEMPLATE } from "../defaults/index.js";

export async function initProject(projectDir) {
    try {
        const targetDir = resolve(projectDir || ".");

        const dirs = {
            root: targetDir,
            markdown: resolve(targetDir, "markdown"),
            dist: resolve(targetDir, "dist"),
            templates: resolve(targetDir, "templates")
        };

        for (const [name, path] of Object.entries(dirs)) {
            if (!existsSync(path)) {
                mkdirSync(path, { recursive: true });
                console.log(`${c.green("✓")} made ${c.cyan(name)} dir: ${c.dim(path)}`);
            } else {
                console.log(`${c.yellow("⚠️")} ${c.cyan(name)} dir already exists: ${c.dim(path)}`);
            }
        }

        const templatePath = resolve(dirs.templates, "template.html");
        if (!existsSync(templatePath)) {
            await writeFile(templatePath, DEFAULT_HTML_TEMPLATE, "utf8");
            console.log(`${c.green("✓")} made template file: ${c.dim(templatePath)}`);
        } else {
            console.log(`${c.yellow("⚠️")} template file already exists: ${c.dim(templatePath)}`);
        }

        const headerPath = resolve(dirs.templates, "header.html");
        if (!existsSync(headerPath)) {
            await writeFile(headerPath, DEFAULT_HEADER_TEMPLATE, "utf8");
            console.log(`${c.green("✓")} made header component: ${c.dim(headerPath)}`);
        } else {
            console.log(`${c.yellow("⚠️")} header component already exists: ${c.dim(headerPath)}`);
        }

        const footerPath = resolve(dirs.templates, "footer.html");
        if (!existsSync(footerPath)) {
            await writeFile(footerPath, DEFAULT_FOOTER_TEMPLATE, "utf8");
            console.log(`${c.green("✓")} made footer component: ${c.dim(footerPath)}`);
        } else {
            console.log(`${c.yellow("⚠️")} footer component already exists: ${c.dim(footerPath)}`);
        }

        const cssPath = resolve(dirs.templates, "css/style.css");
        const cssDir = dirname(cssPath);

        if (!existsSync(cssDir)) {
            mkdirSync(cssDir, { recursive: true });
            console.log(`${c.blue("📁")} created css directory: ${c.dim(cssDir)}`);
        }

        if (!existsSync(cssPath)) {
            await writeFile(cssPath, DEFAULT_CSS_TEMPLATE, "utf8");
            console.log(`${c.green("✓")} made css component: ${c.dim(cssPath)}`);
        } else {
            console.log(`${c.yellow("⚠️")} css component already exists: ${c.dim(cssPath)}`);
        }

        const configPath = resolve(dirs.root, "config.yaml");
        const configContent = DEFAULT_CONFIG_TEMPLATE
            .replace("{template_path}", templatePath)
            .replace("{template_dir}", dirs.templates)
            .replace("{output_dir}", dirs.dist)
            .replace("{version}", VERSION);

        if (!existsSync(configPath)) {
            await writeFile(configPath, configContent, "utf8");
            console.log(`${c.green("✓")} made config file: ${c.dim(configPath)}`);
        } else {
            console.log(`${c.yellow("⚠️")} config file already exists: ${c.dim(configPath)}`);
        }

                const markdownPath = resolve(dirs.markdown, "hello-world.md");
                if (!existsSync(markdownPath)) {
                    await writeFile(markdownPath, DEFAULT_MARKDOWN_TEMPLATE, "utf8");
                    console.log(`${c.green("✓")} made example markdown file: ${c.dim(markdownPath)}`);
                } else {
                    console.log(`${c.yellow("⚠️")} example markdown file already exists: ${c.dim(markdownPath)}`);
                }

                console.log(`\n${c.bold(c.cyan("📝 bloggy"))} project init'd successfully!\n`);
                console.log(`${c.bold(`Try ${c.cyan("📝 bloggy")} out:`)}`);
                console.log(`  ${c.dim(`cd ${projectDir}`)}`);
                console.log(`  ${c.cyan("bloggy")} markdown/hello-world.md\n`);

            } catch (err) {
                console.error(c.red(`failed to init project :(((( : ${err.message}`));
                process.exit(1);
            }
        }