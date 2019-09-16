import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.esm.browser.js'

const vApp = new Vue({
    el: '#app',
    data: {
        selectedPage: '',
        pages: [],
        title: '',
        description: '',
        codeType: 'html',
        codes: {
            html: '',
            css: '',
            js: '',
        },
        libraries: [],
        isPlaying: false,
    },
    computed: {
        code() {
            return this.codes[this.codeType];
        }
    },
    methods: {
        async pageChanged() {
            if (!this.selectedPage) return;
            this.pause();
            const page = await fetch(`./data/${this.selectedPage}.json`).then(r => r.json());
            this.title = page.title;
            this.description = page.description;
            this.libraries = page.libraries;
            this.codes.html = page.html.content;
            this.codes.css = page.css.content;
            this.codes.js = page.js.content;
        },
        play() {
            if (!this.selectedPage) return;
            this.isPlaying = true;
            this.$refs.iframe.srcdoc = `<!doctype html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1">
<title>${this.title}</title>
<style>${this.codes.css}</style>
</head>
<body>${this.codes.html}<script>${this.codes.js}</script></body>
`;
        },
        pause() {
            this.isPlaying = false;
            this.$refs.iframe.srcdoc = '';
        },
    },
    async created() {
        this.pages = await fetch('./data/_index.json').then(r => r.json());
    },
});
