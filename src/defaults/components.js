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

export const DEFAULT_HEADER_TEMPLATE = `<header style="margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
    <nav>
        <a href="/" style="text-decoration: none; margin-right: 15px;">my bloggy blog blog</a>
    </nav>
</header>`;

export const DEFAULT_FOOTER_TEMPLATE = `<footer class="footer">
    Published on {{! date }} at {{! time }}
</footer>`;

export const DEFAULT_CSS_TEMPLATE = `:root {
    --primary-color: {{! color }};
}
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    line-height: 1.6;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    color: #333;
}
h1, h2, h3, h4, h5, h6 {
    color: var(--primary-color);
    margin-top: 1.5em;
}
a {
    color: var(--primary-color);
    text-decoration: none;
}
a:hover {
    text-decoration: underline;
}
code {
    background-color: #f0f0f0;
    padding: 2px 4px;
    border-radius: 3px;
    font-family: 'Courier New', Courier, monospace;
}
pre {
    background-color: #f0f0f0;
    padding: 15px;
    border-radius: 5px;
    overflow-x: auto;
}
pre code {
    background-color: transparent;
    padding: 0;
}
img {
    max-width: 100%;
    height: auto;
}
.footer {
    margin-top: 50px;
    padding-top: 20px;
    border-top: 1px solid #eee;
    font-size: 0.8em;
    color: #666;
}`;
