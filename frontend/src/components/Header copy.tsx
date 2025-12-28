import { Link } from "react-router-dom";
// JavaScripti: useNavigate
// HTMLi: Link, Route, Routes

import { useTranslation } from 'react-i18next';



const Header = () => {
    const { t, i18n } = useTranslation();

    function updateLanguage(newLang: string) {
        i18n.changeLanguage(newLang);
        localStorage.setItem("language", newLang);
    }

    return (
        <div>
            <header>
                <nav className='navbar navbar-expand-lg navbar-light bg-light'>
                    <div className='container-fluid'>
                        <Link className='navbar-brand' to="/">{t('header.storeName')}</Link>
                        <button className='navbar-toggler' type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className='navbar-toggler-icon'></span>
                        </button>
                        <div className='collapse navbar-collapse' id="navbarNav">
                            <ul className='navbar-nav'>
                                <li className='nav-item'>
                                    <Link className='nav-link' aria-current="page" to="/films">{t('header.films')}</Link>
                                </li>
                            </ul>
                            <ul className='navbar-nav'>
                                <li className='nav-item'>
                                    <Link className='nav-link' aria-current="page" to="/rentals">{t('header.rentals')}</Link>
                                </li>
                            </ul>
                        </div>
                        <button className="btn btn-secondary" onClick={() => updateLanguage("et")}>ET</button>
                        <button className="btn btn-success" onClick={() => updateLanguage("en")}>EN</button>
                    </div>
                </nav>
            </header>
        </div>
    )
}

export default Header