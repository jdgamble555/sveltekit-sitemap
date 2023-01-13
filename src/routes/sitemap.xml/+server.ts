import type { RequestHandler } from './$types';
import { SitemapStream, streamToPromise } from 'sitemap';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {

    try {
        const sitemapStream = new SitemapStream({
            hostname: url.origin, 
            xmlns: {
                news: false,
                xhtml: true,
                image: true,
                video: false
            },
            xslUrl: 'sitemap.xsl'
        });

        sitemapStream.write({
            lastmod: new Date().toISOString(),
            url: url.origin 
        });

        sitemapStream.end();

        const sm = (await streamToPromise(sitemapStream)).toString();

        return new Response(sm, {
            headers: { 'content-type': 'application/xml' }
        });
    } catch (e: unknown) {
        throw error(500, e as Error);
    }

};
