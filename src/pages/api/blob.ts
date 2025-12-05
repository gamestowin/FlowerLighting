import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async (context) => {
    const urlParams = new URL(context.url);
    const key = urlParams.searchParams.get('key');
    if (!key) {
        return new Response('Bad Request', { status: 400 });
    }

    // Flower Lighting blob storage implementation needed
    // const blobStore = getStore('shapes');
    // const blob = await blobStore.get(key, { type: 'json' });

    return new Response(
        JSON.stringify({
            blob: null
        })
    );
};
