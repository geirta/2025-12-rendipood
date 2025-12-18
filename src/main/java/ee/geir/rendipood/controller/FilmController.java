package ee.geir.rendipood.controller;

import ee.geir.rendipood.RentalService.FilmService;
import ee.geir.rendipood.entity.Film;
import ee.geir.rendipood.entity.FilmType;
import ee.geir.rendipood.repository.FilmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class FilmController {

    @Autowired
    private FilmService filmService;

    @GetMapping("films")
    public List<Film> filmsInStore(@RequestParam(required = false) Boolean inStock){
        return filmService.filmsInStore(inStock);
    }

    @PostMapping("films")
    public List<Film> addFilm(@RequestBody Film film){
        return filmService.addFilm(film);
    }

    @PostMapping("films-multi")
    public List<Film> addFilms(@RequestBody List<Film> films) {
        return filmService.addFilms(films);
    }

    @DeleteMapping("films/{id}")
    public List<Film> deleteFilm(@PathVariable Long id){
        return filmService.deleteFilm(id);
    }

    @PatchMapping("films-type")
    public List<Film> updateFilm(@RequestParam Long id, @RequestParam FilmType type){
        return filmService.updateFilm(id, type);
    }

}
