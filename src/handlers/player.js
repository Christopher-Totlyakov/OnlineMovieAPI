export async function player(id, type, season, episode) {

    let targetUrl = ``;

    type === "movie" ? targetUrl = `https://vidsrc.icu/embed/${type}/${id}` : targetUrl = `https://vidsrc.icu/embed/${type}/${id}/${season}/${episode}`;

    const response = await fetch(targetUrl, {
        headers: {
            "Referer": "https://vidsrc.icu",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
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
        }
    });
}