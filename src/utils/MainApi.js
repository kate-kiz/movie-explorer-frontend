import { BASE_URL_MAIN } from './constants/mainConstants';
import { BASE_URL_IMAGES } from './constants/mainConstants';

class MainApi {
    constructor({ baseUrl, headers }) {
        this._baseUrl = baseUrl;
        this._headers = headers;
    }

    _checkResponse(res) {
        if (res.ok) {
            return res.json();
        } else {
            return Promise.reject(`Ошибка: ${res.status}`);
        }
    }

    async checkToken(token) {
        return fetch(`${this._baseUrl}/users/me`, {
            method: "GET",
            headers: {
                ...this._headers,
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => this._checkResponse(res));
    }

    async signUp(name, email, password) {
        return fetch(`${this._baseUrl}/signup`, {
            method: "POST",
            headers: this._headers,
            body: JSON.stringify({ name, email, password }),
        })
            .then((res) => this._checkResponse(res));
    };

    async singIn(email, password) {
        return fetch(`${this._baseUrl}/signin`, {
            method: "POST",
            headers: this._headers,
            body: JSON.stringify({ email, password }),
        })
            .then((res) => this._checkResponse(res));
    };

    async getUserInfo() {
        return fetch(`${this._baseUrl}/users/me`, {
            method: "GET",
            headers: {
                ...this._headers,
                Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            },
        })
            .then((res) => this._checkResponse(res));
    };

    async setUserInfo(data) {
        return fetch(`${this._baseUrl}/users/me`, {
            method: "PATCH",
            headers: {
                ...this._headers,
                Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            },
            body: JSON.stringify(data),
        })
            .then((res) => this._checkResponse(res));
    }

    async getSavedMovies() {
        return fetch(`${this._baseUrl}/movies`, {
            headers: {
                ...this._headers,
                Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            },
        })
            .then((res) => this._checkResponse(res));
    }

    async saveMovie({
        country,
        director,
        duration,
        year,
        description,
        image,
        trailerLink,
        nameRU,
        nameEN,
        id,
    }) {
        return fetch(`${this._baseUrl}/movies`, {
            method: "POST",
            headers: {
                ...this._headers,
                Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            },
            body: JSON.stringify({
                country,
                director,
                duration,
                year,
                description,
                image: `${BASE_URL_IMAGES}${image.url}`,
                trailerLink,
                thumbnail: `${BASE_URL_IMAGES}${image.formats.thumbnail.url}`,
                movieId: id,
                nameRU,
                nameEN,
            }),
        })
            .then((res) => this._checkResponse(res));
    }

    async deleteMovie(movieId) {
        return fetch(`${this._baseUrl}/movies/${movieId}`, {
            method: "DELETE",
            headers: {
                ...this._headers,
                Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            },
        })
            .then((res) => this._checkResponse(res));
    }

    setToken() {
        this._headers.Authorization = `Bearer ${localStorage.getItem('jwt')}`;
    }
}

const mainApi = new MainApi({
    baseUrl: BASE_URL_MAIN,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
})

export default mainApi;