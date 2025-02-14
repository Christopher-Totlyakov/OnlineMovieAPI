import { getAllMoviesFilter, getMovieDetails } from './handlers/movies';
import { getAllTVShowsFilter, getTVShowDetails } from './handlers/tvShows';



addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

const corsHeaders = {
    "Access-Control-Allow-Origin": "http://localhost:5173",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

async function handleRequest(request) {

    const allowedOrigin = "http://localhost:5173";
    const requestOrigin = request.headers.get("origin");
    const requestReferer = request.headers.get("referer");

     if (requestOrigin && requestOrigin !== allowedOrigin) {
         return new Response("Access Denied", { status: 403 });
     }
     if (requestReferer && !requestReferer.startsWith(allowedOrigin)) {
         return new Response("Access Denied", { status: 403 });
     }
     if (!requestOrigin) {
         return new Response("Direct requests are not allowed", { status: 403 });
     }

    const url = new URL(request.url);
    const pathname = url.pathname;

    if (request.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    const routes = {
        "/movies": handleMovies,
        "/movie/details": handleMovieDetails,
        "/tv": handleTVShows,
        "/tv/details": handleTVShowsDetails,
    };

    if (routes[pathname]) {
        return routes[pathname](url);
    }

    return new Response("Not found", { status: 404, headers: corsHeaders });
}


async function handleMovies(url) {
    const { page, gteVote, lteVote, prYear, gteYear, lteYear } = extractParams(url);

    const result = await getAllMoviesFilter(prYear, gteYear, lteYear, page, gteVote, lteVote);
    return jsonResponse(result);
}


async function handleMovieDetails(url) {
    
    const { id, language } = extractParams(url);

    const result = await getMovieDetails(id, language);
    return jsonResponse(result);
}


async function handleTVShows(url) {
    const { page, gteVote, lteVote, prYear, gteYear, lteYear } = extractParams(url);

    const result = await getAllTVShowsFilter(prYear, gteYear, lteYear, page, gteVote, lteVote);
    return jsonResponse(result);
}

async function handleTVShowsDetails(url) {
    const { id, language } = extractParams(url);

    const result = await getTVShowDetails(id, language);
    return jsonResponse(result);
}

function extractParams(url) {
    return {
        page: parseInt(url.searchParams.get("page")) || 1,
        gteVote: parseFloat(url.searchParams.get("gteVote")) || 0,
        lteVote: parseFloat(url.searchParams.get("lteVote")) || 6,
        prYear: parseInt(url.searchParams.get("prYear")) || 2023,
        gteYear: url.searchParams.get("gteYear") || "1950-01-01",
        lteYear: url.searchParams.get("lteYear") || "2026-01-01",
        id: parseInt(url.searchParams.get("id")) || 1,
        language: url.searchParams.get("language"),
    };
}


function jsonResponse(data) {
    return new Response(JSON.stringify(data), {
        headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
        }
    });
}
