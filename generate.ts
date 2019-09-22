import cheerio from 'cheerio';
import coffeescript from 'coffeescript';
import sass from 'node-sass';
import { parse as pathParse } from 'path';
import { promises as fs } from 'fs';

interface Snippet {
    language: string;
    content: string;
}

interface Page {
    name: string;
    title: string;
    description: string;
    libraries: string[];
    js: Snippet;
    html: Snippet;
    css: Snippet;
    published: string;
}

const sourceDir = './html/';
const dataDir = './data/';

function replaceAssetPaths(source: string | null): string {
    if (!source) return '';
    const c = (_: unknown, filename: string) => `../assets/${filename}`;
    return source
        .replace(/http:\/\/jsdo.it\/static\/assets\/\w\/\w\/(\w+(\.?\w+)?)/g, c)
        .replace(/http:\/\/jsrun.it\/assets\/\w\/\w\/\w\/\w\/(\w+(\.?\w+)?)/g, c)
        .replace(/http:\/\/jsdo-it-static-contents.s3.amazonaws.com\/assets\/\w\/\w\/\w\/\w\/(\w+(\.?\w+))?/g, c);
}

async function load(file: string): Promise<Page> {
    const { name } = pathParse(file)
    const html = await fs.readFile(sourceDir + file, { encoding: 'utf8' });
    const $ = cheerio.load(html);

    const descriptionBox = $('#boxCodeDescription > .editorBox');
    descriptionBox.children().first().remove();
    const codeJS = $('#codeJS');
    const codeHTML = $('#codeHTML');
    const codeCSS = $('#codeCSS');
    const libraryLoadingScript = $('#boxEditCSS + script').html() || '';
    const libraries = Array.from(
        libraryLoadingScript.matchAll(/initial_tabs\["js"\]\.push\( "(.+?)" \)/g),
        m => m[1]
    );
    return {
        name,
        title: $('meta[property="og:title"]').attr('content'),
        description: replaceAssetPaths(descriptionBox.html()),
        libraries,
        js: {
            language: codeJS.attr('data-lang') || 'js',
            content: replaceAssetPaths(codeJS.val())
        },
        html: {
            language: codeHTML.attr('data-lang') || 'html',
            content: replaceAssetPaths(codeHTML.val())
        },
        css: {
            language: codeCSS.attr('data-lang') || 'css',
            content: replaceAssetPaths(codeCSS.val())
        },
        published: $('time').attr('datetime'),
    } as const;
}

async function convertJS(js: Snippet): Promise<string> {
    switch (js.language) {
        case 'js':
            return js.content;
        case 'coffeescript':
            return coffeescript.compile(js.content);
        default:
            throw new Error(`unknown script language: ${js.language}`);
    }
}

function convertCSS(css: Snippet): Promise<string> {
    switch (css.language) {
        case 'css':
            return Promise.resolve(css.content);
        case 'scss':
            return new Promise((resolve, reject) => {
                sass.render({ data: css.content }, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result.css.toString('utf8'));
                    }
                });
            });
        default:
            throw new Error(`unknown stylesheet language: ${css.language}`);
    }
}

function convertLibraryPath(path: string): string {
    // hard code
    switch (path) {
        case '/lib/three.js-r47':
            return 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r47/Three.min.js';
        case '/lib/jquery-1.5.2.min':
        case '/lib/jquery-1.6.0':
        case '/lib/jquery-1.6.1':
            return 'https://cdnjs.cloudflare.com/ajax/libs/jquery/1.6.1/jquery.min.js';
        case '/lib/jquery-1.6.2':
            return 'https://cdnjs.cloudflare.com/ajax/libs/jquery/1.6.2/jquery.min.js';
        case '/lib/jquery-1.7.2':
            return 'https://cdnjs.cloudflare.com/ajax/libs/jquery/1.7.2/jquery.min.js';
        case '/lib/jquery-2.1.0':
            return 'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.0/jquery.min.js';
        case '/lib/jquery.easing.1.3':
        case '/lib/jquery-ui-1.8.1.min':
            return 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.8.13/jquery-ui.min.js';
        case '/njf/mFlj':
            return 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js';
    }
    const m = path.match(/^\/xl1\/(.+)/);
    if (m) {
        return `./${m[1]}.js`;
    }
    throw Error(`failed to convert library path: ${path}`);
}

function saveIndex(pages: Page[]) {
    const index = pages
        .sort((a, b) => Date.parse(b.published) - Date.parse(a.published))
        .map(({ name, title }) => ({ name, title }));
    return fs.writeFile(`${dataDir}_index.json`, JSON.stringify(index), { encoding: 'utf8' });
}

async function save(page: Page) {
    await fs.writeFile(`${dataDir}${page.name}.json`, JSON.stringify(page));

    const css = await convertCSS(page.css);
    const js = await convertJS(page.js);
    const scripts = page.libraries
        .map(convertLibraryPath)
        .concat([`${page.name}.js`])
        .map(p => `<script src="${p}"></script>`)
        .join('');
    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1">
<title>${page.title}</title>
<link rel="stylesheet" href="${page.name}.css">
</head>
<body>${page.html.content}${scripts}</body>
</html>
`;
    await fs.writeFile(`${dataDir}${page.name}.html`, html);
    await fs.writeFile(`${dataDir}${page.name}.js`, js);
    await fs.writeFile(`${dataDir}${page.name}.css`, css);
}

async function main() {
    const files = await fs.readdir(sourceDir);
    const pages = await Promise.all(files.map(load));
    await saveIndex(pages);
    await Promise.all(pages.map(save));
}

main().catch(console.error);
