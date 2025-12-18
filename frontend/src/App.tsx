import { useEffect, useState } from 'react'
import './App.css'
import type {Film} from './model/Film'

function App() {
  const [films, setFilms] = useState<Film[]>([])

  useEffect(() => {
    fetch("http://localhost:8080/films")
      .then(res => res.json())
      .then(json => setFilms(json))
  });


  return (
    <>
      <div className='container'>
            <h2 className='text-center'>List of Films</h2>
            <table className='table table-hover table-bordered'>
                <thead className='table-success'>
                    <tr>
                        <th>ID</th>
                        <th>Film name</th>
                        <th>Film Type</th>
                        <th>Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        films.map(film =>
                            <tr key={film.id}>
                                <td>{film.id}</td>
                                <td>{film.name}</td>
                                <td>{film.type}</td>
                                <td>{film.inStock}</td>
                            </tr>)
                    }
                </tbody>
            </table>
        </div>
    </>
  )
}

export default App
