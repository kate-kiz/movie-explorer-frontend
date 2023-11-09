import React from 'react';
import { useLocation } from 'react-router-dom';
import AuthBlock from '../AuthBlock/AuthBlock';
import Navigation from '../Navigation/Navigation';
import './Header.css';
import { ROUTES_WITH_HEADER } from '../../utils/constants/routes-constants';

function Header({ isLoggedIn }) {
  const { pathname } = useLocation();
  const hasHeader = ROUTES_WITH_HEADER.includes(pathname);

  return (
    hasHeader && (
      <header className={`${pathname === '/' ? 'header_color_blue' : ''} header`} >
        <div className='header__container'>
          {isLoggedIn ? <Navigation /> : <AuthBlock />}
        </div>
      </header>
    )
  );
};

export default Header;


