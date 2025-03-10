const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${OMDB_API_KEY}`
    }
};

export async function getAllMoviesFilter( prYear, gteYear, lteYear, page, gteVote, lteVote) {
      
    const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&primary_release_year=${prYear}&primary_release_date.gte=${gteYear}&primary_release_date.lte=${lteYear}&sort_by=popularity.desc&vote_average.gte=${gteVote}&vote_average.lte=${lteVote}`;

    const response = await
        fetch(
            url,
            options
        );

    const result = await response.json();
    return result;
}


export async function getMovieDetails(movieId, language = 'en-US') {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=videos&language=${language}`;

    const response = await fetch(url, options);
    const result = await response.json();

    const trailers = result.videos?.results.filter(video => video.type === "Trailer" && video.site === "YouTube") || [];

    delete result.videos;

    return { ...result, trailers };
}



export async function getAllMoviesByNameYearFilter(name, year, page) {

    const url = `https://api.themoviedb.org/3/search/movie?query=${name}&include_adult=false&language=en-US&page=${page}&primary_release_year=${year}`;

    const response = await
        fetch(
            url,
            options
        );

    const result = await response.json();
    return result;
}
