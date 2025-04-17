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

export function printHelp(version) {
    console.log(`${c.bold(c.cyan("📝 bloggy"))} ${c.dim(`(v${version})`)} — markdown -> html generator, but cool frfr`);
    console.log(`
${c.bold("Usage:")} bloggy [${c.green("file.md")}] [options]
${c.bold("Options:")}
  ${c.green("-h")}, ${c.green("--help")}         ...you know what this does, come on
  ${c.green("-v")}, ${c.green("--version")}      shows version 🤯
  ${c.green("-w")}, ${c.green("--watch")}        watches for changes to the md file provided, then regens html file automatically when updated
  ${c.green("-s")}, ${c.green("--server")}       starts a web server with live reload (can be used with or without ${c.green("--watch")})
  ${c.green("-i")}, ${c.green("--init")} [dir]   initializes a new bloggy project in specified directory
  ${c.green("--port")} ${c.yellow("<number>")}   specify port for the web server (default: 3000)
  ${c.green("--no-server")}        doesnt start server when using watch mode
  ${c.green("--no-validate")}      skip all markdown validation checks
  ${c.green("--no-errors")}        skip only error validation
  ${c.green("--no-warns")}         skip only warning validation

${c.bold("Example:")}
  bloggy ${c.magenta("my_post.md")} ${c.green("--no-warns")}
  bloggy ${c.magenta("my_post.md")} ${c.green("--server")} ${c.green("--port")} ${c.yellow("8080")}
  bloggy ${c.magenta("my_post.md")} ${c.green("--watch")} ${c.green("--server")}
  bloggy ${c.green("--init")} ${c.magenta("my-blog")}

${c.bold("Notes:")}
  ${c.bold(c.cyan("📝 bloggy"))} expects a markdown file with ${c.dim('(optional)')} frontmatter like:
     ---
     title: omg
     description: this is how to create nuclear weaponry in your backyard (IAEA not approved)
     color: "#ffffff"
     ---

  ${c.bold(c.cyan("📝 bloggy"))} uses config.yaml for default values & paths (like template.html and output dir)
     so uh... pro tip: customize everything in config.yaml so you never have to touch this script
`);
}

export function printVersion(version) {
    console.log(`${c.bold(c.cyan("📝 bloggy"))} ${c.dim(`(v${version})`)} - ${c.magenta("super epic md thingy")}`);
    console.log(`   made by ${c.green("unium")}, copyright ©${new Date().getFullYear()}`);
}