import type { RequestHandler } from './$types';
import { genSitemap } from '$lib/gen-sitemap';

export const GET: RequestHandler = async ({ url }) => {

    const sm = new genSitemap({
        xsl: 'sitemap.xsl'
    });

    sm.addLink({
        lastmod: new Date().toISOString(),
        loc: url.origin
    });

    return new Response(sm.generate(), {
        headers: { 'content-type': 'application/xml' }
    });
};
