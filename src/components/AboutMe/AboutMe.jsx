import React from "react";
import { Link } from "react-router-dom";
import './AboutMe.css';
import photo from '../../images/profile_photo.jpeg';

function AboutMe() {
	return (
		<section className="about-me">
			<div className="main__header main__header_place_about-me">
				<h2 className="main__subtitle main__subtitle_place_about-me">Студент</h2>
			</div>
			<article className="info">
				<div className="info__text-container">
					<h3 className="info__title">Екатерина</h3>
					<p className="info__subtitle">Фронтенд-разработчик, 23 года</p>
					<p className="info__description">
						Я родилась в Алтайском крае, но уже пять лет живу в Новосибирске, закончила факультет Востоковедения и африканистики в НГУ.
						Несколько лет работала переводчиком с корейского, английского и немецкого языков, но еще со школы мечтала разрабатывать сайты.
						Поэтому, сейчас воплощаю свои мечты в реальность.
					</p>
					<Link
						to='https://github.com/kate-kiz'
						target='_blank'
						className='link info__link'>
						Github
					</Link>
				</div>
				<div className="info__photo-container">
					<img className="info__photo" src={photo} alt='my profile' />
				</div>
			</article>
			<article className="portfolio">
				<h3 className="portfolio__title">Портфолио</h3>
				<ul className="portfolio__list">
					<li className="portfolio__item">
						<Link to="https://github.com/kate-kiz/how-to-learn" target='_blank' className="link portfolio__link">Статичный сайт</Link>
					</li>
					<li className="portfolio__item">
						<Link to="https://kate-kiz.github.io/russian-travel/index.html" target='_blank' className="link portfolio__link">Адаптивный сайт</Link>
					</li>
					<li className="portfolio__item">
						<Link to="https://github.com/kate-kiz/react-mesto-api-full-gha" target='_blank' className="link portfolio__link">Одностраничное приложение</Link>
					</li>
				</ul>
			</article>
		</section>
	)
}

export default AboutMe;