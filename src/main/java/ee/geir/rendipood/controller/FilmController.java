package ee.geir.rendipood.controller;

import ee.geir.rendipood.entity.Film;
import ee.geir.rendipood.entity.FilmType;
import ee.geir.rendipood.repository.FilmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class FilmController {

    @Autowired
    private FilmRepository filmRepository;

    @PostMapping("films")
    public List<Film> addFilm(@RequestBody Film film) {
        if (film.getId() != null) {
            throw new RuntimeException("Can't add a film without an id");
        }
        film.setInStock(true);
        filmRepository.save(film);
        return filmRepository.findAllByOrderByIdAsc();
    }

    @DeleteMapping("films/{id}")
    public List<Film> deleteFilm(@PathVariable Long id) {
        filmRepository.deleteById(id);
        return filmRepository.findAllByOrderByIdAsc();
    }

    @PatchMapping("film-type")
    public List<Film> changeFilmType(@RequestParam Long id, @RequestParam FilmType type) {
        Film film = filmRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Film with id " + id + " not found"));
        film.setType(type);
        filmRepository.save(film);
        return filmRepository.findAllByOrderByIdAsc();
    }

    @GetMapping("films")
    public List<Film> filmsInStore(@RequestParam(required = false) Boolean inStock) {
        if (inStock == null) {
            return filmRepository.findAllByOrderByIdAsc();
        }
        return filmRepository.findByInStockOrderByIdAsc(inStock);
    }




    // enda jaoks suvalt tehtud, et saaks testimise k2igus mitu filmi korraga lisada
    @PostMapping("films-multi")
    public List<Film> addFilm(@RequestBody List<Film> films) {
        for (Film f : films) {
            if (f.getId() != null) {
                throw new RuntimeException("Can't add a film without an id");
            }
            f.setInStock(true);
            filmRepository.save(f);
        }
        return filmRepository.findAllByOrderByIdAsc();
    }


}
