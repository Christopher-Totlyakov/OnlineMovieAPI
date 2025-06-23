import { getAllMoviesFilter, getAllMoviesByNameYearFilter, getMovieDetails, getAllMovieGenres, getMovieRecommendations, getMovieTrending } from './handlers/movies';
import { getAllTVShowsFilter, getAllTVShowsByNameYearFilter, getTVShowDetails, getAllTVGenres, getTVRecommendations, getTVTrending } from './handlers/tvShows';
import { player } from './handlers/player';



addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

const allowedOrigin = "https://onlinemoviesmania.pages.dev";

const corsHeaders = {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

async function handleRequest(request) {
    const requestOrigin = request.headers.get("origin");
    const requestReferer = request.headers.get("referer");

    if (request.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: corsHeaders,
        });
    }

    if (requestOrigin && requestOrigin !== allowedOrigin) {
        return new Response("Access Denied: Invalid Origin", {
            status: 403,
            headers: corsHeaders,
        });
    }

    if (requestReferer && !requestReferer.startsWith(allowedOrigin)) {
        return new Response("Access Denied: Invalid Referer", {
            status: 403,
            headers: corsHeaders,
        });
    }

    if (!requestOrigin) {
    	if (requestReferer && requestReferer.startsWith(allowedOrigin)) {
    	} else {
        	return new Response("Direct requests are not allowed", {
          	 	status: 403,
          	 	headers: corsHeaders,
       		});
    	}
	}

    const url = new URL(request.url);
    const pathname = url.pathname;

    const routes = {
        "/movies": handleMovies,
        "/movies/genres": handleMovieGenres,
        "/movie/details": handleMovieDetails,
        "/movie/recommendations": handleMovieRecommendations,
        "/movie/trending": handleMovieTrending,
        "/tv": handleTVShows,
        "/tv/genres": handleTVShowGenres,
        "/tv/details": handleTVShowsDetails,
        "/tv/recommendations": handleTVRecommendations,
        "/tv/trending": handleTVTrending,
        "/player": handleVideoProxy,
    };

    if (routes[pathname]) {
        return routes[pathname](url);
    }

    return new Response("Not found", { status: 404, headers: corsHeaders });
}


async function handleMovies(url) {
    const { page, gteVote, lteVote, prYear, gteYear, lteYear, name, year, genres } = extractParams(url);

    let result;
    if (name || year) {
        result = await getAllMoviesByNameYearFilter(name, year, page);
    } else {
        result = await getAllMoviesFilter(prYear, gteYear, lteYear, page, gteVote, lteVote, genres);
    }

    return jsonResponse(result);
}

async function handleMovieDetails(url) {
    
    const { id, language } = extractParams(url);

    const result = await getMovieDetails(id, language);
    return jsonResponse(result);
}

async function handleTVShows(url) {
    const { page, gteVote, lteVote, prYear, gteYear, lteYear, name, year, genres } = extractParams(url);

    let result;
    if (name || year) {
        result = await getAllTVShowsByNameYearFilter(name, year, page);
    } else {
        result = await getAllTVShowsFilter(prYear, gteYear, lteYear, page, gteVote, lteVote, genres);
    }

    return jsonResponse(result);
}

async function handleTVShowsDetails(url) {
    const { id, language } = extractParams(url);

    const result = await getTVShowDetails(id, language);
    return jsonResponse(result);
}

async function handleTVShowGenres(url) {
    const result = await getAllTVGenres();
    return jsonResponse(result);
}

async function handleMovieGenres(url) {
    const result = await getAllMovieGenres();
    return jsonResponse(result);
}

async function handleMovieRecommendations(url) {
    const { id } = extractParams(url);
    const result = await getMovieRecommendations(id);
    return jsonResponse(result);
}

async function handleTVRecommendations(url) {
    const { id } = extractParams(url);
    const result = await getTVRecommendations(id);
    return jsonResponse(result);
}

async function handleMovieTrending(url) {
    const { time } = extractParams(url);
    const result = await getMovieTrending(time);
    return jsonResponse(result);
}

async function handleTVTrending(url) {
    const { time } = extractParams(url);
    const result = await getTVTrending(time);
    return jsonResponse(result);
}

async function handleVideoProxy(url) {

    const { id, type, season, episode } = extractParams(url);

    return await player(id, type, season, episode);  
}

function extractParams(url) {
    return {
        page: parseInt(url.searchParams.get("page")) || 1,
        gteVote: parseFloat(url.searchParams.get("gteVote")) || 0,
        lteVote: parseFloat(url.searchParams.get("lteVote")) || 10,
        prYear: parseInt(url.searchParams.get("prYear")),
        gteYear: url.searchParams.get("gteYear") || '1900',
        lteYear: url.searchParams.get("lteYear") || new Date().getFullYear(),
        id: parseInt(url.searchParams.get("id")),
        language: url.searchParams.get("language"),
        name: url.searchParams.get("name"),
        year: parseInt(url.searchParams.get("year")),
        time: url.searchParams.get("time") || "day",
        genres: url.searchParams.get("genres") || "",

        type: url.searchParams.get("type") || "",
        season: url.searchParams.get("season") || "",
        episode: url.searchParams.get("episode") || "",
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
