
export async function getAllMoviesFilter( prYear, gteYear, lteYear, page, gteVote, lteVote) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${OMDB_API_KEY}`
        }
    };
    
    const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&primary_release_year=${prYear}&primary_release_date.gte=${gteYear}&primary_release_date.lte=${lteYear}&sort_by=popularity.desc&vote_average.gte=${gteVote}&vote_average.lte=${lteVote}`;

    console.log(url);
    const response = await
        fetch(
            url,
            options
        );

    const result = await response.json();
    return result;
}