import React, { useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useValidation from '../../hooks/useValidation';
import './Login.css';

function Login({ handleLogin, isLoggedIn, isError, isFetching, message }) {
  const {
    value,
    error,
    isValid,
    handleChange,
  } = useValidation();

  const navigate = useNavigate();

  const handleSubmit = useCallback((event) => {
    event.preventDefault();

    if (isValid) {
      const { email, password } = value
      handleLogin(email, password);
    }
  }, [handleLogin, isValid, value]);

  useEffect(() => {
    if (isLoggedIn) navigate("/movies");
  }, [isLoggedIn, navigate]);

  return (
    <section className="login">
      <div className="login__container">
        <Link to="/" className="login__logo" alt="logo">
        </Link>
        <h2 className="login__title">Рады видеть!</h2>
        <form className="login__form login__form_place_login" onSubmit={handleSubmit}>
          <label className="login__label">
            <span className="login__label-text">Email</span>
            <input
              className="login__input"
              type="email"
              name="email"
              pattern="^[\w]+@[a-zA-Z]+\.[a-zA-Z]{1,3}$"
              required
              value={value.email || ''}
              onChange={handleChange}
            />
            <span className="login__error-message">{error.email}</span>
          </label>
          <label className="login__label">
            <span className="login__label-text">Пароль</span>
            <input
              className="login__input login__input_type_password"
              type="password"
              name="password"
              required
              value={value.password || ''}
              onChange={handleChange}
            />
            <p className="login__error-message">{isError ? message : ''}</p>
            <span className="login__error-message">{error.password}</span>
          </label>
          <div className="login__submit-block">
            <button
              className={`button-hover login__submit-button ${isValid ? 'login__submit-button_disabled' : ''}`}
              type="submit"
              disabled={!isValid || !value.email || !value.password || isFetching}
            >
              Войти
            </button>
            <p className="login__register-text">
              Ещё не зарегистрированы?{" "}
              <Link to="/sign-up" className="link login__link">
                Регистрация
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Login;
