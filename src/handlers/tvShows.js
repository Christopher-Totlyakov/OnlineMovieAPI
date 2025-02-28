const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${OMDB_API_KEY}`
    }
};

export async function getAllTVShowsFilter( prYear, gteYear, lteYear, page, gteVote, lteVote) {
      
    const url = `https://api.themoviedb.org/3/discover/tv?include_adult=false&include_video=false&language=en-US&page=${page}&first_air_date_year=${prYear}&first_air_date.gte=${gteYear}&first_air_date.lte=${lteYear}&sort_by=popularity.desc&vote_average.gte=${gteVote}&vote_average.lte=${lteVote}`;
   
    const response = await
        fetch(
            url,
            options
        );

    const result = await response.json();
    return result;
}


export async function getTVShowDetails( TVShowsId, language='en-US' ) {
    
    const url = `https://api.themoviedb.org/3/tv/${TVShowsId}?append_to_response=videos&language=${language}`;

    const response = await fetch(url, options);
    const result = await response.json();

    const trailers = result.videos?.results.filter(video => video.type === "Trailer" && video.site === "YouTube") || [];

    delete result.videos;

    return { ...result, trailers };
}