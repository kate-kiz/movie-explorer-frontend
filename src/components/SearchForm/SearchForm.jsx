import React, { useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import FilterCheckbox from '../FilterCheckbox/FilterCheckbox';
import useValidation from '../../hooks/useValidation';
import find from '../../images/icons/find.svg';
import './SearchForm.css';


function SearchForm({ handleSubmitSearch, handleShortFilmsCheckbox }) {
  const {
    value,
    handleChange,
    error,
    isValid,
  } = useValidation({ search: "" });

  const getInputValue = useCallback(() => {
    if ("search" in value) {
      return value.search || "";
    }

    const lastValue = localStorage.getItem("movie-search-last-keyword");
    // console.log("last value", lastValue);
    if (lastValue === null) {
      localStorage.setItem("movie-search-last-keyword", "");
    }
    return lastValue || "";
  }, [value]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!isValid) {
      // possibly show error here
      return;
    }

    handleSubmitSearch(getInputValue());
  }, [isValid, getInputValue, handleSubmitSearch]);

  return (
    <form id="search-form" className="search-form" onSubmit={handleSubmit}>
      <div className="search-form__container">
        <input
          className={`search-form__input ${error.search ? 'search-form__input-error' : ''}`}
          type="text"
          placeholder="Фильм"
          name="search"
          minLength={2}
          value={getInputValue()}
          onChange={handleChange}
          required
          autoFocus
        />
        <button
          // className={`button-hover search-form__button ${values.search ? 'search-form__button-active' : ''}`}
          className='button-hover search-form__button'
          type="submit"
          disabled={!isValid}
          form="search-form"
        >
          {/* <img className='search-form__button_image' alt='blue round button' src={find} /> */}
        </button>
      </div>
      {error.search && <span className="search-form__error">{error.search}</span>}
      <FilterCheckbox
        handleShortFilmsCheckbox={handleShortFilmsCheckbox}
      />
    </form>
  );
}

export default SearchForm;

