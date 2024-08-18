const fs = require('fs');
const path = require('path');
const { createServer } = require('vite');
const { renderToString } = require('@vue/server-renderer');

const pkgRoot = path.resolve(__dirname, '../..');
const pjRoot = process.cwd();

async function prerender() {
  const server = await createServer({
    configFile: path.resolve(pkgRoot, 'vite.config.js'),
    server: { middlewareMode: 'ssr' },
    appType: 'custom',
  });

  try {
    const { createApp } = await server.ssrLoadModule(path.resolve(pkgRoot, 'src/main.js'));
    const { app, router } = createApp();

    router.push('/');
    await router.isReady();

    const appHtml = await renderToString(app);

    const templatePath = path.resolve(pjRoot, 'dist/index.html');
    const template = fs.readFileSync(templatePath, 'utf-8');

    const assetsDir = path.resolve(pjRoot, 'dist/assets');
    const files = fs.readdirSync(assetsDir);
    const cssFile = files.find(file => file.endsWith('.css'));
    const jsFile = files.find(file => file.endsWith('.js'));

    let html = template.replace('<div id="app"></div>', `<div id="app">${appHtml}</div>`);
    const cssTag = `<link rel="stylesheet" href="/assets/${cssFile}">`;
    const scriptTag = `<script type="module" src="/assets/${jsFile}"></script>`;
    html = html.replace('</head>', `${cssTag}</head>`);
    html = html.replace('<script type="module" src="/src/main.js"></script>', scriptTag);

    fs.writeFileSync(path.resolve(pjRoot, 'dist/index.html'), html);

    const publicDir = path.resolve(pjRoot, 'dist/public');
    if (fs.existsSync(publicDir)) {
      fs.rmSync(publicDir, { recursive: true, force: true });
    }
  } catch (e) {
    console.error('Error during prerendering:', e);
  } finally {
    await server.close();
  }
}

module.exports = { prerender };