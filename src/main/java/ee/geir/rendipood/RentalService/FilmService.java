package ee.geir.rendipood.RentalService;

import ee.geir.rendipood.entity.Film;
import ee.geir.rendipood.entity.FilmType;
import ee.geir.rendipood.repository.FilmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FilmService {

    @Autowired
    private FilmRepository filmRepository;

    public List<Film> filmsInStore(Boolean inStock){
        if(inStock == null) return filmRepository.findAllByOrderByIdAsc();
        return filmRepository.findByInStockOrderByIdAsc(inStock);
    }

    public List<Film> addFilm(Film film){
        if(film.getId() != null) throw new RuntimeException("Can't add a film with an existing id!");
        film.setInStock(true);
        filmRepository.save(film);
        return filmRepository.findAllByOrderByIdAsc();
    }

    public List<Film> addFilms(List<Film> films) {
        for (Film f : films) {
            if (f.getId() != null) {
                throw new RuntimeException("Can't add a film without an id");
            }
            f.setInStock(true);
            filmRepository.save(f);
        }
        return filmRepository.findAllByOrderByIdAsc();
    }

    public List<Film> deleteFilm(Long id){
        filmRepository.deleteById(id);
        return filmRepository.findAllByOrderByIdAsc();
    }

    public List<Film> updateFilm(Long id, FilmType type){
        Film film = filmRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Film with id "+ id +" not found"));
        film.setType(type);
        filmRepository.save(film);
        return filmRepository.findAllByOrderByIdAsc();
    }
}