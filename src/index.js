/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { getAllMoviesFilter } from './handlers/movies';

// async function DataRequest(type, name, year, page) {
//     const API_KEY = OMDB_API_KEY;

//     const currentYear = new Date().getFullYear();
//     let url = `https://www.omdbapi.com/?apikey=${API_KEY}&type=${type}&s=${name}&page=${page}`;

//     if (year >= 1900 && year <= currentYear) {
//         url += `&y=${year}`;
//     }

//     const response = await fetch(url);
//     const result = await response.json();

//     return result;
// }

// Cloudflare Worker event listener
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    const corsHeaders = {
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    };

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
        const allowedOrigin = "http://localhost:5173";
        const requestOrigin = request.headers.get("origin");

        if (requestOrigin && requestOrigin !== allowedOrigin) {
            return new Response("Access Denied", { status: 403 });
        }
        const page = parseInt(url.searchParams.get("page")) || 1;
        const gteVote = parseFloat(url.searchParams.get("gteVote")) || 0;
        const lteVote = parseFloat(url.searchParams.get("lteVote")) || 6;
        const prYear = parseInt(url.searchParams.get("prYear")) || 2023;
        const gteYear = url.searchParams.get("gteYear") || "1950-01-01";
        const lteYear = url.searchParams.get("lteYear") || "2026-01-01";


        const result = await getAllMoviesFilter(prYear, gteYear, lteYear, page, gteVote, lteVote);

        return new Response(JSON.stringify(result), {
            headers: {
                ...corsHeaders,
                "Content-Type": "application/json"
            }
        });
    }

    return new Response("Not found", {
        status: 404,
        headers: corsHeaders
    });
}