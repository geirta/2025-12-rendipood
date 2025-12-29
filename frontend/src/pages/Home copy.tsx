import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import type {Film} from '../model/Film'

import type { CartProduct } from '../model/CartProduct';

const backendUrl = import.meta.env.VITE_API_HOST;

function Home() {

  const { t } = useTranslation();
  const [films, setFilms] = useState<Film[]>([])
  
  const [selectedFilmId, setSelectedFilmId] = useState<number | "">("");
  const [rentalDays, setRentalDays] = useState<number>(1);
  const [cart, setCart] = useState<CartProduct[]>(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    if (cart.length === 0) {
      localStorage.removeItem("cart");
    } else {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  useEffect(() => {
    fetch(`${backendUrl}/films`)
      .then(res => res.json())
      .then(json => setFilms(json))
  }, []);

  const loadFilms = () => {
    fetch(`${backendUrl}/films`)
      .then(res => res.json())
      .then(json => setFilms(json))
      .catch(console.error);
  };

  useEffect(() => {
    loadFilms();
  }, []);

  const startRental = () => {
    if (cart.length === 0)
      return;

    const preppedFilms = cart.map(item => ({
      filmId: item.film.id,
      days: item.days
    }));

    fetch(`${backendUrl}/start-rental`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(preppedFilms)
    })
      .then(res => {
        if (!res.ok) throw Error("Failed to start rental");
        return res.json();
      })
      .then((totalFee: number) => {
        alert(`Rental started! Total fee: ${totalFee}`);
        setCart([]);
        loadFilms();
      })
      .catch(e => console.error(e));

  };

  function addToCart(selectedFilmToAddId: number | "", rentalDays: number) {
    if (selectedFilmToAddId === "" || rentalDays < 1) return;

    const filmToAdd = films.find(f => f.id === selectedFilmToAddId);
    if (!filmToAdd || !filmToAdd.inStock) return;

    setCart(prev => {
      const existing = prev.find(c => c.film.id === filmToAdd.id);
      if (existing) {
        return prev.map(item =>
          item.film.id === filmToAdd.id
          ? { ...item, days: rentalDays }
          : item
        );
      }
      return [...prev, {film: filmToAdd, days: rentalDays}];
    });
    setSelectedFilmId("");
    setRentalDays(1);
  }

  return (
    <div className='container'>
      <div className='selectRentalFilms'>
        <h2>{t('home.startRental.title')}</h2>
        <div className="form-group">
          <label>{t('home.startRental.film')}</label><br></br>
          <select id="filmName" className='dataField form-control' 
            value={selectedFilmId} 
            onChange={e => setSelectedFilmId(Number(e.target.value))}
          >
            <option value="">{t('home.startRental.selectFilm')}</option>
            {films.map(film => (
              <option key={film.id} value={film.id} disabled={!film.inStock}>
                {film.name} {film.inStock ? "" : " - OUT OF STOCK"}
              </option>
            ))}
          </select>
          
        </div>
        <div className="form-group">
          <label>{t('home.startRental.days')}</label><br></br>
          <input id="initialDays" type="number" min={1}
            value={rentalDays} 
            onChange={e => setRentalDays(Number(e.target.value))} className='dataField form-control'></input>
        </div>
        {/* <button type="submit" onClick={addToRental} className="btn btn-primary">{t('home.startRental.addFilmBtn')}</button> */}
        <button onClick={() => addToCart(selectedFilmId, rentalDays)} className="btn btn-primary">{t('home.startRental.addFilmBtn')}</button>
      </div>


      <div className='selectedRentalFilms'>
        <h2>{t('home.selectedMovies.title')}</h2>
        <form>
          <table className='table table-striped table-bordered'>
              <thead className='table-success'>
                <tr>
                    <th>ID</th>
                    <th>{t('home.selectedMovies.name')}</th>
                    <th>{t('home.selectedMovies.days')}</th>
                    <th>{t('home.selectedMovies.remove')}</th>
                </tr>
              </thead>
              <tbody>
                {cart.map(item => (
                  <tr key={item.film.id}>
                    <td>{item.film.id}</td>
                    <td>{item.film.name}</td>
                    <td>{item.days}</td>
                    <td>
                      <button onClick={() => 
                        setCart(prev =>
                          prev.filter(c => c.film.id !== item.film.id)
                        )}>
                        {t('home.selectedMovies.removeFilmBtn')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
          </table>
          <button type="button" className="btn btn-primary" 
            onClick={startRental} disabled={cart.length === 0}
            >
              {t('home.selectedMovies.startRentalBtn')}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Home
