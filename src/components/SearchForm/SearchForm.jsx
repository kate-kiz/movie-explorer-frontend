import React, { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import FilterCheckbox from '../FilterCheckbox/FilterCheckbox';
import useValidation from '../../hooks/useValidation';
import './SearchForm.css';

function SearchForm({ localStorageItemName, movieFormCheckbox, handleSubmitSearch, handleShortFilmsCheckbox, isError, message }) {
  const {
    value,
    handleChange,
    error,
    isValid,
  } = useValidation({ search: "" });

  const { pathname } = useLocation();

  const getInputValue = useCallback(() => {
    if ("search" in value) {
      return value.search || "";
    }

    const lastValue = localStorage.getItem(localStorageItemName);
    if (lastValue === null) {
      localStorage.setItem(localStorageItemName, "");
    }
    return lastValue || "";
  }, [localStorageItemName, value]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!isValid) {
      return;
    }
    handleSubmitSearch(getInputValue());
  }, [isValid, handleSubmitSearch, getInputValue]);

  return (
    <form id="search-form" className="search-form" onSubmit={handleSubmit}>
      <div className="search-form__container">
        <input
          className={`search-form__input ${error.search ? 'search-form__input-error' : ''}`}
          type="text"
          placeholder="Фильм"
          name="search"
          // minLength={2}
          value={getInputValue()}
          onChange={handleChange}
          required
          autoFocus
        />
        <button
          className='button-hover search-form__button'
          type="submit"
          disabled={!isValid}
          form="search-form"
        >
        </button>
      </div>
      {isError ? <span className="search-form__error">{message}</span> : ""}
      <FilterCheckbox
        handleShortFilmsCheckbox={handleShortFilmsCheckbox}
        defaultChecked={movieFormCheckbox}
      />
    </form>
  );
}

export default SearchForm;

