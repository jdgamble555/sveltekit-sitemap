export type changeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
export type priority = 0.0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1.0;

export type Optional<T> = undefined | null | T;

type allowedStandardTags = 'urlset' | 'url' | 'loc' | 'lastmod' | 'changefreq' | 'priority';
type allowedExtendedTags = 'image:image' | 'image:loc';
type allowedTags = allowedStandardTags | allowedExtendedTags;

// https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap
// todo - add pretty print
// todo - add news
// todo - add videos
// todo = add streaming

// https://www.sitemaps.org/protocol.html

export interface sitemapTag {
    loc: string;
    lastmod?: Optional<string>;
    changefreq?: Optional<changeFreq>;
    priority?: Optional<priority>;
    images?: Optional<string[] | string>;
};

export class genSitemap {

    private feed: string[] = [];
    private pretty: boolean;
    private useImage: boolean;
    private xsl: string;

    constructor({ useImage = false, pretty = false, xsl = '' } = {}) {
        this.pretty = pretty;
        this.useImage = useImage;
        this.xsl = xsl;
    }

    addLink(tag: sitemapTag) {

        const link: string[] = [];

        // add loc
        const loc = this.createTag('loc', tag.loc);
        link.push(...loc);

        // lastmod
        if (tag.lastmod) {
            const lastmod = this.createTag('lastmod', tag.lastmod);
            link.push(...lastmod);
        }

        // images
        if (tag.images) {

            // force to be array
            const images = tag.images.length
                ? tag.images
                : [tag.images];

            // add image namespace
            this.useImage = true;

            for (let i = 0; i < images.length; ++i) {
                const image_loc = this.createTag('image:loc', images[i]);
                const image_image = this.createTag('image:image', image_loc);
                link.push(...image_image);
            }
        }

        // changefreq
        if (tag.changefreq) {
            const changefreq = this.createTag('changefreq', tag.changefreq);
            link.push(...changefreq);
        }

        // priority
        if (tag.priority) {
            // todo - check for leading zeros
            const priority = this.createTag('priority', tag.priority.toString());
            link.push(...priority);
        }

        // create url
        const url = this.createTag('url', link);
        this.feed.push(...url);
        return this;
    }

    private urlset_open() {
        // https://www.sitemaps.org/protocol.html - validate sitemap?

        let urlset = 'urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
        if (this.useImage) {
            urlset += ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"';
        }
        return urlset;
    }

    private createTag(tagName: allowedTags, content: string | string[]): string[] {
        const openTag = tagName === 'urlset' ? this.urlset_open() : tagName;
        return ([] as string[]).concat(`<${openTag}>`, content, `</${tagName}>`);
    }

    generate() {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>';
        const urlset = this.createTag('urlset', this.feed);
        if (this.xsl) {
            xml += `<?xml-stylesheet type="text/xsl" href="${this.xsl}" ?>`;
        }
        this.feed = [xml].concat(urlset);
        return this.feed.join('');
    }
}