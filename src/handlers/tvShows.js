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

export async function getAllTVShowsFilter(prYear, gteYear, lteYear, page, gteVote, lteVote, genres) {
      
    const url = `https://api.themoviedb.org/3/discover/tv?include_adult=false&include_video=false&language=en-US&page=${page}&first_air_date_year=${prYear}&first_air_date.gte=${gteYear}-01-01&first_air_date.lte=${lteYear}-01-01&sort_by=popularity.desc&vote_average.gte=${gteVote}&vote_average.lte=${lteVote}&with_genres=${genres}`;
   
    return await returnResponseJson(url);
}


export async function getTVShowDetails( TVShowsId, language='en-US' ) {
    
    const url = `https://api.themoviedb.org/3/tv/${TVShowsId}?append_to_response=videos&language=${language}`;

    const result = await returnResponseJson(url);

    const trailers = result.videos?.results.filter(video => video.type === "Trailer" && video.site === "YouTube") || [];

    delete result.videos;

    return { ...result, trailers };
}

export async function getAllTVShowsByNameYearFilter(name, year, page) {

    const url = `https://api.themoviedb.org/3/search/tv?query=${name}&first_air_date_year=${year}&include_adult=false&language=en-US&page=${page}`;

    return await returnResponseJson(url);
}

export async function getAllTVGenres() {

    const url = `https://api.themoviedb.org/3/genre/tv/list?language=en`;

    return await returnResponseJson(url);
}

export async function getTVRecommendations(id) {

    const url = `https://api.themoviedb.org/3/tv/${id}/recommendations?language=en-US&page=1`;

    return await returnResponseJson(url);
}

export async function getTVTrending(time_window) {

    const url = `https://api.themoviedb.org/3/trending/tv/${time_window}?language=en-US`;

    return await returnResponseJson(url);
}