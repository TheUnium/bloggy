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

export const LIVE_RELOAD_SCRIPT = `
<!-- shhhh no touchy -->
<script src="/socket.io/socket.io.js"></script>
<script>
  (function() {
    const socket = io();
    socket.on('reload', function() {
      console.log('reloading page...');
      location.reload();
    });
    console.log('connected!');
  })();

  // copyright thing in dev server pages
  document.getElementById('year').textContent = new Date().getFullYear();
</script>
`;

export const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

export const ERROR_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ERROR_CODE}}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            dark: {
              900: '#121212',
              800: '#181818',
              700: '#202020',
              600: '#282828',
              500: '#303030',
              400: '#404040',
              300: '#505050',
              200: '#606060',
              100: '#808080',
            },
            accent: {
              500: '#6366f1',
              600: '#4f46e5',
              700: '#4338ca',
            }
          }
        }
      }
    }
  </script>
</head>
<body class="bg-dark-900 text-gray-200 min-h-screen flex items-center justify-center">
  <div class="container mx-auto max-w-xl p-4">
    <header class="mb-8 border-b border-dark-600 pb-4">
      <div class="flex items-center justify-between">
        <h1 class="text-5xl font-bold text-white tracking-tight">📄 bloggy</h1>
      </div>
    </header>
    <main>
      <div class="bg-dark-800 rounded-lg shadow-lg overflow-hidden">
        <div class="bg-red-900 p-4 border-b border-red-800">
          <h2 class="text-xl font-semibold text-white tracking-tight">{{ERROR_TITLE}}</h2>
        </div>
        <div class="p-6">
          <div class="flex items-start mb-5">
            <div class="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-white">{{ERROR_CODE}}</h3>
              <p class="mt-1 text-sm text-gray-400">Error time: <span class="font-mono">{{ERROR_TIME}}</span></p>
            </div>
          </div>
          <div class="bg-dark-700/70 rounded-md p-4 border border-dark-600 mb-5">
            <p class="text-gray-300 text-sm">{{ERROR_MESSAGE}}</p>
          </div>
          <div class="flex space-x-3">
            <button
              onclick="history.back()"
              class="flex-1 inline-flex justify-center items-center bg-dark-600 hover:bg-dark-500 text-white font-medium px-4 py-2 rounded-md transition duration-200 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
              </svg>
              Back
            </button>
            <button
              onclick="location.reload()"
              class="flex-1 inline-flex justify-center items-center bg-accent-600 hover:bg-accent-700 text-white font-medium px-4 py-2 rounded-md transition duration-200 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>
    </main>
    <footer class="mt-12 pt-4 border-t border-dark-600 text-gray-500 text-sm">
      <div class="flex flex-col md:flex-row md:justify-between space-y-2 md:space-y-0">
        <p>&copy; <span id="year"></span> unium - bloggy</p>
      </div>
    </footer>
  </div>
  {{LIVE_RELOAD_SCRIPT}}
</body>
</html>
`;

export const NOT_FOUND_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 Not Found</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            dark: {
              900: '#121212',
              800: '#181818',
              700: '#202020',
              600: '#282828',
              500: '#303030',
              400: '#404040',
              300: '#505050',
              200: '#606060',
              100: '#808080',
            },
            accent: {
              500: '#6366f1',
              600: '#4f46e5',
              700: '#4338ca',
            }
          }
        }
      }
    }
  </script>
</head>
<body class="bg-dark-900 text-gray-200 min-h-screen flex items-center justify-center">
  <div class="container mx-auto max-w-xl p-4">
    <header class="mb-8 border-b border-dark-600 pb-4">
      <div class="flex items-center justify-between">
        <h1 class="text-5xl font-bold text-white tracking-tight">📄 bloggy</h1>
      </div>
    </header>
    <main>
      <div class="bg-dark-800 rounded-lg shadow-lg overflow-hidden">
        <div class="bg-red-900 p-4 border-b border-red-800">
          <h2 class="text-xl font-semibold text-white tracking-tight">Page not found</h2>
        </div>
        <div class="p-6">
          <div class="flex items-start mb-5">
            <div class="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-white">404 Page Not Found</h3>
              <p class="mt-1 text-sm text-gray-400">Error time: <span class="font-mono">{{ERROR_TIME}}</span></p>
            </div>
          </div>
          <div class="bg-dark-700/70 rounded-md p-4 border border-dark-600 mb-5">
            <p class="text-gray-300 text-sm">Requested path: <code class="font-mono bg-dark-700 px-1 py-0.5 rounded text-xs">{{REQUEST_PATH}}</code></p>
          </div>
          <div class="flex space-x-3">
            <button
              onclick="history.back()"
              class="flex-1 inline-flex justify-center items-center bg-dark-600 hover:bg-dark-500 text-white font-medium px-4 py-2 rounded-md transition duration-200 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
              </svg>
              Back
            </button>
            <button
              onclick="location.reload()"
              class="flex-1 inline-flex justify-center items-center bg-accent-600 hover:bg-accent-700 text-white font-medium px-4 py-2 rounded-md transition duration-200 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>
    </main>
    <footer class="mt-12 pt-4 border-t border-dark-600 text-gray-500 text-sm">
      <div class="flex flex-col md:flex-row md:justify-between space-y-2 md:space-y-0">
        <p>&copy; <span id="year"></span> unium - bloggy</p>
      </div>
    </footer>
  </div>
  {{LIVE_RELOAD_SCRIPT}}
</body>
</html>
`;

export const HOME_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>bloggy</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            dark: {
              900: '#121212',
              800: '#181818',
              700: '#202020',
              600: '#282828',
              500: '#303030',
              400: '#404040',
              300: '#505050',
              200: '#606060',
              100: '#808080',
            },
            accent: {
              500: '#6366f1',
              600: '#4f46e5',
              700: '#4338ca',
            }
          }
        }
      }
    }
  </script>
</head>
<body class="bg-dark-900 text-gray-200 min-h-screen flex items-center justify-center">
  <div class="container mx-auto max-w-xl p-4">
    <header class="mb-8 border-b border-dark-600 pb-4">
      <div class="flex items-center justify-between">
        <h1 class="text-5xl font-bold text-white tracking-tight">📄 bloggy</h1>
      </div>
    </header>
    <main>
      <div class="bg-dark-800 rounded-lg shadow-lg overflow-hidden">
        <div class="bg-dark-700 p-4 border-b border-dark-600">
          <h2 class="text-xl font-semibold text-white tracking-tight">Development Server</h2>
        </div>

        <div class="p-6">
          <div class="space-y-3">
            <p class="text-gray-300 leading-relaxed">
              Hello there! You aren't really supposed to see this page... please navigate to an available page!
            </p>
          </div>

          <div class="mt-6 bg-dark-700/50 rounded-lg p-3 border border-dark-600 flex items-center">
            <div class="flex-shrink-0 mr-3">
              <div class="w-2 h-2 rounded-full bg-green-500 ring-2 ring-green-500/20"></div>
            </div>
            <span class="text-gray-300 text-sm">Server is running on {{SERVER_PORT}}</span>
          </div>

          {{#PAGES}}
          <div class="mt-6 bg-dark-800/70 rounded-lg px-4 py-3 border border-dark-600">
            <div class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="text-gray-300 text-sm">Available Pages:</p>
                <ul class="mt-2 space-y-2">
                  {{PAGE_LINKS}}
                </ul>
              </div>
            </div>
          </div>
          {{/PAGES}}
        </div>
      </div>
    </main>
    <footer class="mt-12 pt-4 border-t border-dark-600 text-gray-500 text-sm">
      <div class="flex flex-col md:flex-row md:justify-between space-y-2 md:space-y-0">
        <p>&copy; <span id="year"></span> unium - bloggy</p>
      </div>
    </footer>
  </div>
  {{LIVE_RELOAD_SCRIPT}}
</body>
</html>
`;