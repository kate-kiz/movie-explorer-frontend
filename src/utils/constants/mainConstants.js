
// export const BASE_URL_MAIN = 'https://api.movie-explorer.nomoredomainsicu.ru'; //my domain
export const BASE_URL_MAIN = 'http://84.201.167.213'; //my domain
export const BASE_URL_MOVIES = 'https://api.nomoreparties.co/beatfilm-movies';
export const BASE_URL_IMAGES = 'https://api.nomoreparties.co';

export const HTTP_EXPRESSION = /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)$/;
export const EMAIL_EXPRESSION = /^[-\\w.]+@([A-z0-9][-A-z0-9]+\\.)+[A-z]{2,4}$/;

export const RES_MESSAGE = {
    MESSAGE_SUCCESS: 'Всё прошло успешно!',
    MESSAGE_REGISTER_SUCCESS: 'Вы успешно зарегистрировались!',
    MESSAGE_UPDATE_SUCCESS: 'Ваши данные успешно изменены',
    MESSAGE_ERROR: 'Во время запроса произошла ошибка. Возможно, проблема с соединением или сервер недоступен. Подождите немного и попробуйте ещё раз.',
    MESSAGE_BAD_REQUEST: 'Что-то пошло не так.',
};

export const SEARCH_MESSAGE = {
    MESSAGE_EMPTY: 'Нужно ввести ключевое слово',
    MESSAGE_NOT_FOUND: 'Ничего не найдено',
    MESSAGE_NOTHING_SAVED: 'У вас нет сохранённых фильмов',
    MESSAGE_SEARCH_ERROR: 'Во время загрузки сохранённых фильмов произошла ошибка. Подождите немного и попробуйте обновить страницу.',
};