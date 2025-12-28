import { useEffect, useState } from 'react'
import type { Rental } from '../model/Rental';
import type { RentalFilm } from '../model/RentalFilm';
import type {Film} from '../model/Film'
import { useTranslation } from 'react-i18next';
import '../App.css'

const backendUrl = import.meta.env.VITE_API_HOST;


function Rentals() {

  const { t } = useTranslation();
  const [films, setFilms] = useState<Film[]>([])
  const [rentals, setRentals] = useState<Rental[]>([])
  const [rentalFilms, setRentalFilms] = useState<RentalFilm[]>([])
  const [actualDays, setActualDays] = useState<number>(1);

  useEffect(() => {
    fetch(`${backendUrl}/rentals`)
      .then(res => res.json())
      .then(json => setRentals(json))
  }, []);

  useEffect(() => {
    fetch(`${backendUrl}/rental-films`)
      .then(res => res.json())
      .then(json => setRentalFilms(json))
  }, []);

  useEffect(() => {
      fetch(`${backendUrl}/films`)
        .then(res => res.json())
        .then(json => setFilms(json))
    }, []);

  return (
    <div className='container'>
      <div className='returnFilms'>
        <h2>{t('rentals.return')}</h2>
        <div>
          <label>{t('rentals.filmName')}</label>
          <select className='form-control'>
            {films
            .filter(film => !film.inStock)
            .map(film => (
              <option key={film.id} value={film.id}>
                {film.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>{t('rentals.days')}</label>
          <input type="number" value={actualDays} min={1} onChange={e => setActualDays(Number(e.target.value))} className='form-control'></input>
        </div>
        <div>
          <button className="btn btn-primary">{t('rentals.returnBtn')}</button>
        </div>
      </div>
      
      <div className='rentals'>
        <h2>{t('rentals.active')}</h2>
            <table className='table table-bordered table-hover'>
              <thead className='table-success'>
                <tr>
                    <th>ID</th>
                    <th>{t('rentals.initialFee')}</th>
                    <th>{t('rentals.lateFee')}</th>
                </tr>
              </thead>
              <tbody>
                {rentals.map(rental => (
                  <tr key={rental.id}>
                    <td>{rental.id}</td>
                    <td>{rental.initialFee}</td>
                    <td>{rental.lateFee}</td>
                  </tr>
                ))}
              </tbody>
          </table>
      </div>
    </div>
  )
}

export default Rentals
