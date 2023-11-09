import React, { useCallback, useContext, useEffect } from "react";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import { Link } from 'react-router-dom';
import './Profile.css';
import useValidation from "../../hooks/useValidation";

function Profile({ handleSignOut, handleEditProfile, isFetching, isError, message, currentUser }) {
	const [isEditing, setIsEditing] = React.useState(false);
	const user = useContext(CurrentUserContext);

	const {
		value,
		handleChange,
		resetForm,
		error,
		isValid,
	} = useValidation({});

	const handleEditProfileClick = useCallback(() => {
		setIsEditing(() => !isEditing);
	}, [isEditing]);

	const handleEditProfileSubmit = useCallback((e) => {
		e.preventDefault();
		if (!isEditing || !isValid) return;
		handleEditProfile(value.email, value.name)
		setIsEditing(false);
	}, [handleEditProfile, isEditing, isValid, value.email, value.name]);

	useEffect(() => {
		// resetForm({ name: currentUser.name, email: currentUser.email });
		if (currentUser) {
			resetForm(currentUser, {}, true);
		}
	}, [resetForm, currentUser]);

	return (
		<section className="profile">
			<div className="profile__container">
				<h1 className="profile__title">Привет, {currentUser ? currentUser.name : '...'}!</h1>
				<form id="edit-profile-submit" className="profile__form">
					<label className="profile__form-label border">
						Имя
						<input
							className="profile__form-input"
							type="text"
							name="name"
							id="name-input"
							placeholder="Имя"
							minLength={2}
							maxLength={30}
							value={value.name || ""}
							onChange={handleChange}
							disabled={!isEditing}
							pattern="^[A-ZА-ЯËa-za-яё]+(?:[ \-][A-ZА-ЯËa-za-яё]+)*$"
						/>
					</label>
					<label className="profile__form-label">
						E-mail
						<input
							className="profile__form-input"
							type="email"
							name="email"
							id="email-input"
							placeholder="E-mail"
							pattern="^[\w]+@[a-zA-Z]+\.[a-zA-Z]{1,3}$"
							value={value.email || ""}
							onChange={handleChange}
							disabled={!isEditing}
							required
						/>
					</label>
					{isError ? <p className="profile__error-message">{message}</p> : ""}
					{!isEditing ? (
						<>
							<button
								type="button"
								className="profile__edit-button"
								onClick={handleEditProfileClick}
							>
								Редактировать
							</button>
							<Link className="link profile__exit-button" to="/" onClick={handleSignOut}>
								Выйти из аккаунта
							</Link>
						</>
					) : (
						<button
							type="button"
							className={`button-hover profile__save-button ${isValid ? 'profile__save-button_disabled' : ''}`}
							onClick={handleEditProfileSubmit}
							onSubmit={handleEditProfileSubmit}
							form="edit-profile-submit"
							disabled={!isValid || (value.email === currentUser.email && value.name === currentUser.name) || isFetching}
						>
							Сохранить
						</button>
					)}
				</form>
			</div>
		</section>
	)
}

export default Profile;