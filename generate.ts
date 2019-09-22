import cheerio from 'cheerio';
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
        description: descriptionBox.html() || '',
        libraries,
        js: {
            language: codeJS.attr('data-lang') || 'js',
            content: codeJS.val()
        },
        html: {
            language: codeHTML.attr('data-lang') || 'html',
            content: codeHTML.val()
        },
        css: {
            language: codeCSS.attr('data-lang') || 'css',
            content: codeCSS.val()
        },
        published: $('time').attr('datetime'),
    } as const;
}

function saveIndex(pages: Page[]) {
    const index = pages
        .sort((a, b) => Date.parse(b.published) - Date.parse(a.published))
        .map(({ name, title }) => ({ name, title }));
    return fs.writeFile(`${dataDir}_index.json`, JSON.stringify(index), { encoding: 'utf8' });
}

function save(page: Page) {
    return fs.writeFile(`${dataDir}${page.name}.json`, JSON.stringify(page), { encoding: 'utf8' });
}

async function main() {
    const files = await fs.readdir(sourceDir);
    const pages = await Promise.all(files.map(load));
    await saveIndex(pages);
    await Promise.all(pages.map(save));
}

main().catch(console.error);
