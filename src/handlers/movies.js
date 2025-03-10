const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${OMDB_API_KEY}`
    }
};

async function returnResponseJson(url) {
    const response = await
        fetch(
            url,
            options
        );

    const result = await response.json();
    return result;
}

export async function getAllMoviesFilter(prYear, gteYear, lteYear, page, gteVote, lteVote) {

    const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&primary_release_year=${prYear}&primary_release_date.gte=${gteYear}-01-01&primary_release_date.lte=${lteYear}-01-01&sort_by=popularity.desc&vote_average.gte=${gteVote}&vote_average.lte=${lteVote}`;
    await returnResponseJson(url);
}


export async function getMovieDetails(movieId, language = 'en-US') {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=videos&language=${language}`;

    const result = await returnResponseJson(url);

    const trailers = result.videos?.results.filter(video => video.type === "Trailer" && video.site === "YouTube") || [];

    delete result.videos;

    return { ...result, trailers };
}



export async function getAllMoviesByNameYearFilter(name, year, page) {

    const url = `https://api.themoviedb.org/3/search/movie?query=${name}&include_adult=false&language=en-US&page=${page}&primary_release_year=${year}`;

    await returnResponseJson(url);
}

export async function getAllMovieGenres() {

    const url = `https://api.themoviedb.org/3/genre/movie/list?language=en`;

    await returnResponseJson(url);
}

export async function getMovieRecommendations(id) {

    const url = `https://api.themoviedb.org/3/movie/${id}/recommendations?language=en-US&page=1`;

    await returnResponseJson(url);
}