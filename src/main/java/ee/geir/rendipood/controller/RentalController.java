package ee.geir.rendipood.controller;

import ee.geir.rendipood.RentalService.RentalService;
import ee.geir.rendipood.dto.RentalFilmDTO;
import ee.geir.rendipood.entity.Film;
import ee.geir.rendipood.entity.Rental;
import ee.geir.rendipood.entity.RentalFilm;
import ee.geir.rendipood.repository.FilmRepository;
import ee.geir.rendipood.repository.RentalFilmRepository;
import ee.geir.rendipood.repository.RentalRepository;
import ee.geir.rendipood.util.Calculations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class RentalController {

    @Autowired
    private RentalRepository rentalRepository;
    @Autowired
    private FilmRepository filmRepository;
    @Autowired
    private RentalFilmRepository rentalFilmRepository;
    @Autowired
    private RentalService rentalService;


    @PostMapping("start-rental")
    public double startRental(@RequestBody List<RentalFilmDTO> rentalFilms) {
        return rentalService.startRental(rentalFilms);
    }

    // TODO: KOJU :: arvuta hind vastavalt tüübile ja võetud päevadele
    // end-rental -> FilmID + tegelikud rendip2evad

    @PostMapping("end-rental")
    public double endRental(@RequestBody List<RentalFilmDTO> rentalFilms) {
        return rentalService.endRental(rentalFilms);
    }


}
