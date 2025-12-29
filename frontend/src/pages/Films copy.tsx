import { useEffect, useState } from 'react'
import '../App.css'
import type {Film, FilmType} from '../model/Film'
import { useTranslation } from 'react-i18next';

const backendUrl = import.meta.env.VITE_API_HOST;

function Films() {
  const FILM_TYPES: FilmType[] = ["NEW", "REGULAR", "OLD"];
  const [films, setFilms] = useState<Film[]>([])
  const [filmName, setFilmName] = useState("")
  const [filmType, setFilmType] = useState<FilmType | "">("");
  const { t } = useTranslation();
  const [editingFilmId, setEditingFilmId] = useState<number | null>(null)



  useEffect(() => {
    fetch(`${backendUrl}/films`)
      .then(res => res.json())
      .then(json => setFilms(json))
  }, []);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        fetch(`${backendUrl}/films`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: filmName,
                type: filmType,
                inStock: true
            })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to save film");
                }
                return res.json();
            })
            .then((updatedFilms: Film[]) => {
                setFilms(updatedFilms);
                setFilmName("");
                setFilmType("");
            })
            .catch(err => console.error(err));
    };

    const handleDelete = (id: number) => {
        console.log("Deleting film ID:", id);
        fetch(`${backendUrl}/films/${id}`, {
            method: "DELETE" 
        })
            .then(res => {
                console.log("Response:", res);
                if (!res.ok) throw new Error("Failed to delete film");
                setFilms(prev => prev.filter(film => film.id !== id));
            })
            .catch(err => console.error(err));
    };

    const handleTypeChange = (id: number, newType: FilmType) => {
        fetch(`${backendUrl}/films-type?id=${id}&type=${newType}`, {
            method: "PATCH" 
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to update film type");
                return res.json();
            })
            .then((updatedFilms: Film[]) => {
                setEditingFilmId(null);
                setFilms(updatedFilms);
            })
            .catch(err => console.error(err));
    };

    const cancelEdit = () => {
        setEditingFilmId(null);
    };


  return (
    <>
        <div className='container'>
            <div className='addNewFilm'>
                <h2>{t('addFilm.title')}</h2>
                <form onSubmit={handleSave}>
                    <div className="form-group">
                        <label>{t('addFilm.name')}</label><br></br>
                        <input id="filmName" type="text" value={filmName} className='dataField form-control'
                            onChange={e => setFilmName(e.target.value)}>
                        </input>
                    </div>
                    <div className="form-group">
                        <label>{t('addFilm.type')}</label><br></br>
                        <select id="filmType" value={filmType} className='dataField form-control'
                            onChange={e => setFilmType(e.target.value as FilmType)}>
                                <option value="" disabled>
                                    {t('films.selectFilmType')}  {/* translation key */}
                                </option>
                                {FILM_TYPES.map(type => (
                                    <option key={type} value={type}>
                                        {t(`films.filmType.${type}`)}
                                    </option>
                                ))}
                        </select>
                    </div>
                    
                    <button type="submit" className="btn btn-primary">{t('home.startRental.addFilmBtn')}</button>
                </form>
            </div>
            
            
            <div className='displayFilms'>
                <h2>{t('films.title')}</h2>
                <table className='table table-bordered'>
                    <thead className='table-success'>
                        <tr>
                            <th>ID</th>
                            <th>{t('films.header.filmName')}</th>
                            <th>{t('films.header.filmType')}</th>
                            <th>{t('films.header.inStock')}</th>
                            <th>{t('films.header.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            films.map(film =>
                                <tr key={film.id}>
                                    <td>{film.id}</td>
                                    <td>{film.name}</td>
                                    <td>
                                        <select value={film.type}
                                            onChange={e => handleTypeChange(film.id, e.target.value as FilmType)}
                                            disabled={editingFilmId !== film.id}
                                        >
                                            {FILM_TYPES.map(type => (
                                                <option key={type} value={type}>
                                                    {t(`films.filmType.${type}`)}
                                                </option>
                                            ))}
                                        </select>


                                    </td>
                                    <td>{t(`films.inStock.${film.inStock}`)}</td>
                                    <td>
                                        <button className={`btn ${editingFilmId === film.id ? "btn-secondary" : "btn-warning"}`}
                                            onClick={() => editingFilmId === film.id ? cancelEdit() : setEditingFilmId(film.id)}>
                                                {editingFilmId === film.id ? t('films.cancel') : t('films.edit')}
                                        </button>
                                        <button className='btn btn-danger' 
                                            hidden={editingFilmId === film.id}
                                            onClick={() => handleDelete(film.id)}
                                        >
                                            {t('films.delete')}
                                        </button>
                                    </td>
                                </tr>)
                        }
                    </tbody>
                </table>
            </div>

            
        </div>
    </>
  )
}

export default Films
