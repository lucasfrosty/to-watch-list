import axios from 'axios';

const API_KEY = process.env.REACT_APP_API_KEY;

export const TYPES = {
  movie: 'movie',
  tv: 'tv',
};

/**
 * @param {string} query - The name of the Movie or TV Show
 * @param {string: 'movie' or 'tv'} type - Defining if it is a Movie or a TV Show
 * @returns {string} - The API URL for the query passed by
 */
export const getApiURL = (query, type) => {
  if (type === 'tv' || type === 'movie') {
    const URL =
      `https://api.themoviedb.org/3/search/${type}?api_key=${API_KEY}&language=en-US&query=${query}&page=1`;

    return axios(URL).then(response => response.data.results);
  }

  return null;
};


/**
 * @param {string} image_path - the path (provided for the API itself) for the image
 * @param {number} size - the size of the image
 * @returns {string} - The image URL
 */
export const getImage = (image_path, size) => {
  const URL = `https://image.tmdb.org/t/p/w${size}${image_path}`;

  return axios(URL).then(response => response.data.results);
};


/**
 * @description Given an genre_ids array, convert to string and display it on the provided Query
 * @param {arrayOf(genres_ids)} genres - The Array with the genres, provided by the API.
 * @param {string: 'movie' or 'tv'} type - Defining if it is a Movie or a TV Show
 * @param {string} selector - A query selector to define where to put the list converted
 * @returns nothing (i'm not happy with this approach but was the only way i founded)
 */
export const convertAndDisplayGenres = (genres, type, selector) => {
  const genresURL = `https://api.themoviedb.org/3/genre/${type}/list?api_key=${API_KEY}&language=en-US`;
  console.log('Requesting data from ', URL);

  axios(genresURL)
    .then(response => response.data.genres)
    .then((genresListFromAPI) => {
      const genresToString = genres.map(genre =>
        genresListFromAPI.filter(genreFromAPI => genreFromAPI.id === genre).map(g => g.name));

      document.querySelector(selector).innerHTML = genresToString.concatAll().join(', ');
    })
    .catch(err => console.error(err));
};

export const getPopular = (type) => {
  const URL =
    `https://api.themoviedb.org/3/${type}/popular?api_key=${API_KEY}&language=en-US&page=1`;

  return axios(URL).then(response => response.data.results);
};
