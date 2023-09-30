import React, { useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import useValidation from '../../hooks/useValidation';

function Register({ isLoggedIn, handleRegister, isError, isFetching, message }) {
	const {
		value,
		handleChange,
		error,
		isValid,
	} = useValidation();

	const navigate = useNavigate();

	useEffect(() => {
		if (isLoggedIn) navigate("/");
	}, [isLoggedIn, navigate]);

	const handleSubmit = useCallback((event) => {
		event.preventDefault();

		if (isValid) {
			const { name, email, password } = value;
			console.log("Handle register", name, email, password);
			handleRegister(name, email, password);
		}
	}, [handleRegister, isValid, value]);

	useEffect(() => {
		if (isLoggedIn) navigate('/movies');
	});

	return (
		<section className="login">
			<div className="login__container">
				<Link to="/" className="login__logo" alt="logo"></Link>
				<h2 className="login__title">Добро пожаловать!</h2>
				<form className="login__form login__form_place_register" onSubmit={handleSubmit}>
					<label className="login__label">
						<span className="login__label-text">Имя</span>
						<input
							className="login__input"
							type="name"
							name="name"
							minLength={2}
							value={value.name || ''}
							onChange={handleChange}
							required
							pattern="^[A-ZА-ЯËa-za-яё]+(?:[ -][A-ZА-ЯËa-za-яё]+)*$"
						/>
						{error.name && <span className="login__error-message">{error.name}</span>}
					</label>
					<label className="login__label">
						<span className="login__label-text">Email</span>
						<input
							className="login__input"
							type="email"
							name="email"
							value={value.email || ''}
							onChange={handleChange}
							pattern="^[\w]+@[a-zA-Z]+\.[a-zA-Z]{1,3}$"
							required
						/>
						{error.email && <span className="login__error-message">{error.email}</span>}
					</label>
					<label className="login__label">
						<span className="login__label-text">Пароль</span>
						<input
							className="login__input login__input_type_password"
							type="password"
							name="password"
							value={value.password || ''}
							onChange={handleChange}
							required
						/>
						<p className="login__error-message">{isError ? message : ''}</p>
						{error.password && <span className="login__error-message">{error.password}</span>}
					</label>
					<div className="login__submit-block login__submit-block_place_register">
						<button
							className={`button-hover login__submit-button ${isValid ? '' : 'login__submit-button_disabled'}`}
							type="submit"
							disabled={!isValid || !value.name || !value.email || !value.password || isFetching}
						>
							Зарегистрироваться
						</button>
						<p className="login__register-text">
							Уже зарегистрированы?{" "}
							<Link to="/sign-in" className="link login__link">
								Войти
							</Link>
						</p>
					</div>
				</form>
			</div>
		</section>
	);
}

export default Register;