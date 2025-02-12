/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

async function DataRequest(type, name, year, page) {
    const API_KEY = OMDB_API_KEY;

    const currentYear = new Date().getFullYear();
    let url = `https://www.omdbapi.com/?apikey=${API_KEY}&type=${type}&s=${name}&page=${page}`;

    if (year >= 1900 && year <= currentYear) {
        url += `&y=${year}`;
    }

    const response = await fetch(url);
    const result = await response.json();

    return result;
}
//test deploy
// Cloudflare Worker event listener
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const url = new URL(request.url);
     const pathname = url.pathname;

    // Позволени CORS заглавки
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",  // или замени '*' с 'http://localhost:5173' за по-строг контрол
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    };

    // Обработване на CORS preflight заявките (OPTIONS)
    if (request.method === "OPTIONS") {
        return new Response(null, {
            headers: corsHeaders
        });
    }
	if (pathname === '/') {
        return new Response('Welcome to Online Movie Worker! Use /movies?name=YourMovie', {
            headers: { 'Content-Type': 'text/plain' },
        });
    }

    if (pathname === "/movies") {
        const name = url.searchParams.get("name") || "Batman";
        const year = parseInt(url.searchParams.get("year")) || 2023;
        const page = parseInt(url.searchParams.get("page")) || 1;

        const result = await DataRequest("movie", name, year, page);
        return new Response(JSON.stringify(result), {
            headers: {
                ...corsHeaders,  // Добавяне на CORS заглавките към отговора
                "Content-Type": "application/json"
            }
        });
    }

    return new Response("Not found", {
        status: 404,
        headers: corsHeaders
    });
}