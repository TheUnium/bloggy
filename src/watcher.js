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
import { watch } from "fs";
import { bloggy, loadConfig } from "./bloggy.js";
import { createServer } from "http";
import { readFile } from "fs/promises";
import { join, dirname, basename, resolve } from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { CONFIG } from "./utils/index.js";
import { stat } from "fs/promises";
import { extname } from "path";

import { LIVE_RELOAD_SCRIPT, MIME_TYPES, ERROR_TEMPLATE, HOME_TEMPLATE, NOT_FOUND_TEMPLATE } from "./defaults/watcher.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function startServer(outputDir, port = 3000) {
  const server = createServer(async (req, res) => {
    try {
      if (req.url === '/socket.io/socket.io.js') {
        const socketIoPath = join(__dirname, 'node_modules', 'socket.io', 'client-dist', 'socket.io.js');
        try {
          const content = await readFile(socketIoPath);
          res.writeHead(200, { 'Content-Type': 'text/javascript' });
          res.end(content);
          return;
        } catch (err) {
          console.error(c.red(`Failed to serve socket.io client: ${err.message}`));
          res.writeHead(500);
          res.end('Internal server error');
          return;
        }
      }

      let filePath = join(outputDir, req.url === '/' ? '' : req.url);
      if (req.url === '/') {
        try {
          const pages = await listHtmlFiles(outputDir);
          const pageLinks = pages.map(page => {
            const pageName = basename(page, '.html');
            return `<li><a href="/${page}" class="text-accent-500 hover:text-accent-600 transition duration-200 text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
              ${pageName}
            </a></li>`;
          }).join('\n');

          let homeContent = HOME_TEMPLATE
            .replace('{{SERVER_PORT}}', `http://localhost:${port}`)
            .replace('{{LIVE_RELOAD_SCRIPT}}', LIVE_RELOAD_SCRIPT);

          if (pages.length > 0) {
            homeContent = homeContent
              .replace('{{#PAGES}}', '')
              .replace('{{/PAGES}}', '')
              .replace('{{PAGE_LINKS}}', pageLinks);
          } else {
            homeContent = homeContent
              .replace(/{{#PAGES}}[\s\S]*?{{\/PAGES}}/g, '');
          }

          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(homeContent);
          return;
        } catch (err) {
          console.error(c.red(`Error generating home page: ${err.message}`));
        }
      }

      if (!extname(filePath)) {
        try {
          const stats = await stat(filePath);
          if (stats.isDirectory()) {
            filePath = join(filePath, 'index.html');
          }
        } catch (err) {
          filePath += '.html';
        }
      }

      try {
        let content = await readFile(filePath, 'utf8');
        const ext = extname(filePath).toLowerCase();
        if (ext === '.html') {
          const bodyCloseIndex = content.lastIndexOf('</body>');
          if (bodyCloseIndex !== -1) {
            content = content.slice(0, bodyCloseIndex) + LIVE_RELOAD_SCRIPT + content.slice(bodyCloseIndex);
          } else {
            content += LIVE_RELOAD_SCRIPT;
          }
        }

        const contentType = MIME_TYPES[ext] || 'text/plain';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);

      } catch (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          const notFoundPage = NOT_FOUND_TEMPLATE
            .replace('{{REQUEST_PATH}}', req.url)
            .replace('{{ERROR_TIME}}', new Date().toISOString())
            .replace('{{LIVE_RELOAD_SCRIPT}}', LIVE_RELOAD_SCRIPT);
          res.end(notFoundPage);
        } else {
          console.error(c.red(`i womped...\n---\n${err.message}\n---`));
          res.writeHead(500, { 'Content-Type': 'text/html' });
          const errorPage = ERROR_TEMPLATE
            .replace('{{ERROR_TITLE}}', 'Server Error')
            .replace('{{ERROR_CODE}}', '500 Internal Server Error')
            .replace('{{ERROR_TIME}}', new Date().toISOString())
            .replace('{{ERROR_MESSAGE}}', err.message)
            .replace('{{LIVE_RELOAD_SCRIPT}}', LIVE_RELOAD_SCRIPT);
          res.end(errorPage);
        }
      }
    } catch (err) {
      console.error(c.red(`i womped...\n---\n${err.message}\n---`));
      res.writeHead(500, { 'Content-Type': 'text/html' });
      const errorPage = ERROR_TEMPLATE
        .replace('{{ERROR_TITLE}}', 'Server Error')
        .replace('{{ERROR_CODE}}', '500 Internal Server Error')
        .replace('{{ERROR_TIME}}', new Date().toISOString())
        .replace('{{ERROR_MESSAGE}}', err.message)
        .replace('{{LIVE_RELOAD_SCRIPT}}', LIVE_RELOAD_SCRIPT);
      res.end(errorPage);
    }
  });

  const io = new Server(server);

  server.listen(port, () => {
    console.log(c.green(`🚀 bloggy watch server running @ ${c.cyan(`http://localhost:${port}`)}`));
    console.log(c.dim(`   serving files from: ${outputDir}`));
  });

  return { server, io };
}

async function listHtmlFiles(dir) {
  try {
    const files = await readdir(dir);
    return files.filter(file => extname(file).toLowerCase() === '.html');
  } catch (err) {
    console.error(c.yellow(`i womped when listing html files... so sad...\n---\n${err.message}\n---`));
    return [];
  }
}

async function readdir(dir) {
  try {
    const { readdir } = await import('fs/promises');
    return await readdir(dir);
  } catch (err) {
    console.error(c.red(`i womped when reading dirs... so sad...\n---\n${err.message}\n---`));
    return [];
  }
}

async function setupWatcher(inputPath, options = {}) {
    const {
        skipValidation = false,
        showErrors = true,
        showWarns = true,
        serverPort = 3000,
        enableServer = true
    } = options;

    let timeout;
    await loadConfig();
    const outputDir = CONFIG.paths.output_dir;
    let io;

    if (enableServer) {
        const server = await startServer(outputDir, serverPort);
        io = server.io;
        await bloggy(inputPath, {
            isWatchMode: true,
            skipValidation,
            showErrors,
            showWarns
        });

        const htmlFilename = basename(inputPath, '.md') + '.html';
        console.log(c.cyan(`📄 view your page @ ${c.bold(`http://localhost:${serverPort}/${htmlFilename}`)}`));
    }

    const mdWatcher = watch(inputPath, async (eventType) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(async () => {
            await loadConfig();
            try {
                await bloggy(inputPath, {
                    isWatchMode: true,
                    skipValidation,
                    showErrors,
                    showWarns
                });

                if (io) {
                    io.emit('reload');
                }
            } catch (err) {
                console.error(c.red(`i womped...\n---\n${err.message}\n---`));
            }
        }, 200);
    });

    const templatePath = CONFIG.paths.template;
    let templateWatcher;
    try {
        templateWatcher = watch(templatePath, async (eventType, filename) => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(async () => {
                console.log(c.magenta(`🎨 template file changed: ${filename || templatePath}`));
                await loadConfig();

                try {
                    await bloggy(inputPath, {
                        isWatchMode: true,
                        skipValidation,
                        showErrors,
                        showWarns
                    });

                    if (io) {
                        io.emit('reload');
                    }
                } catch (err) {
                    console.error(c.red(`i womped...\n---\n${err.message}\n---`));
                }
            }, 200);
        });
    } catch (err) {
        console.warn(c.yellow(`i womped...\n---\n${err.message}\n---`));
    }

    const configPath = resolve(process.cwd(), "config.yaml");
    let configWatcher;
    try {
        configWatcher = watch(configPath, async (eventType, filename) => {
            console.log(c.blue(`🛠️ config file changed: ${filename || configPath}`));
            await loadConfig();
            console.log(c.dim('🛠️ updated config loaded'));
        });
    } catch (err) {
        console.warn(c.yellow(`i womped...\n---\n${err.message}\n---`));
    }

    process.on("SIGINT", () => {
        console.log(c.yellow("\n👋 cya :("));
        mdWatcher.close();
        if (templateWatcher) templateWatcher.close();
        if (configWatcher) configWatcher.close();
        process.exit(0);
    });
}

export { setupWatcher };