export async function player(id, type, season, episode) {

    let targetUrl = ``;

    type === "movie" ? targetUrl = `https://vidsrc.icu/embed/${type}/${id}` : targetUrl = `https://vidsrc.icu/embed/${type}/${id}/${season}/${episode}`;

    const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
            "Referer": "https://vidsrc.icu",
            "User-Agent": "Mozilla/5.0",
            "Origin": "https://online-movie-worker.laminex0622.workers.dev"
        },
    });

    let text = await response.text();

    text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
    console.log(text);

    return new Response(text, {
        headers: {
            ...response.headers,
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "text/html",
            "X-Frame-Options": "ALLOWALL",
        }
    });
}