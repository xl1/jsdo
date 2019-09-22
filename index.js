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
        src() {
            if (!this.isPlaying) return 'data:text/html;charset=utf-8,';
            return `data/${this.selectedPage}.html`;
        }
    },
    methods: {
        async pageChanged() {
            if (!this.selectedPage) return;
            this.pause();
            const page = await fetch(`data/${this.selectedPage}.json`).then(r => r.json());
            this.title = page.title;
            this.description = page.description;
            this.libraries = page.libraries;
            this.codes.html = hljs.highlight(page.html.language, page.html.content, true).value;
            this.codes.css = hljs.highlight(page.css.language, page.css.content, true).value;
            this.codes.js = hljs.highlight(page.js.language, page.js.content, true).value;
        },
        play() {
            this.isPlaying = !!this.selectedPage;
        },
        pause() {
            this.isPlaying = false;
        },
    },
    async created() {
        this.pages = await fetch('./data/_index.json').then(r => r.json());
    },
});
