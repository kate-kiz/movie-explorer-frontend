import React, { useCallback, useContext, useEffect } from "react";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import { Link } from 'react-router-dom';
import './Profile.css';
import useValidation from "../../hooks/useValidation";

function Profile({ handleSignOut, handleEditProfile }) {
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
		if (!isEditing || !isValid) return;
		handleEditProfile(value.email, value.name)
		setIsEditing(false);
	}, [handleEditProfile, isEditing, isValid, value.email, value.name]);

	useEffect(() => {
		resetForm({ name: user.name, email: user.email });
	}, [resetForm, user]);

	return (
		<section className="profile">
			<div className="profile__container">
				<h1 className="profile__title">{`Привет, ${user.name}`}</h1>
				<form id="edit-profile-submig" className="profile__form">
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
							value={value.email || ""}
							onChange={handleChange}
							disabled={!isEditing}
						/>
					</label>
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
							className="button-hover profile__save-button"
							onClick={handleEditProfileSubmit}
							onSubmit={handleEditProfileSubmit}
							form="edit-profile-submig"
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