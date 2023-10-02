import React, { useState } from 'react';
import './FilterCheckbox.css';

function FilterCheckbox({ handleShortFilmsCheckbox, defaultChecked }) {

  return (
    <div className="filter-checkbox">
      <label className="filter-checkbox__switch">
        <input
          className="filter-checkbox__input"
          type="checkbox"
          defaultChecked={defaultChecked}
          onClick={handleShortFilmsCheckbox}
        />
        <span className="filter-checkbox__slider round"></span>
      </label>
      <p className="filter-checkbox__text">Короткометражки</p>
    </div>
  );
}

export default FilterCheckbox;
