import type { RequestHandler } from './$types';
import { generateSitemap } from '$lib/generate-sitemap';

export const GET: RequestHandler = async ({ url }) => {

    const sitemap = new generateSitemap({
        xsl: 'sitemap.xsl'
    });

    sitemap.addLink({
        lastmod: new Date().toISOString(),
        loc: url.origin
    });

    return new Response(sitemap.generate(), {
        headers: { 'content-type': 'application/xml' }
    });
};
