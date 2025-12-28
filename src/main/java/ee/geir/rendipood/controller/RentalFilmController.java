package ee.geir.rendipood.controller;

import ee.geir.rendipood.entity.RentalFilm;
import ee.geir.rendipood.repository.RentalFilmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class RentalFilmController {

    @Autowired
    private RentalFilmRepository rentalFilmRepository;

    @GetMapping("/rental-films")
    public List<RentalFilm> getRentalFilm(){
        return rentalFilmRepository.findAll();
    }

}
