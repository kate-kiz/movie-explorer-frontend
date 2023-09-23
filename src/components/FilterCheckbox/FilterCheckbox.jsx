import React, { useState } from 'react';
import './FilterCheckbox.css';

function FilterCheckbox({ handleShortFilmsCheckbox }) {

  return (
    <div className="filter-checkbox">
      <label className="filter-checkbox__switch">
        <input
          className="filter-checkbox__input"
          type="checkbox"
          defaultChecked={localStorage.getItem("movie-search-short-movies") === String(true)}
          onClick={handleShortFilmsCheckbox}
        />
        <span className="filter-checkbox__slider round"></span>
      </label>
      <p className="filter-checkbox__text">Короткометражки</p>
    </div>
  );
}

export default FilterCheckbox;
