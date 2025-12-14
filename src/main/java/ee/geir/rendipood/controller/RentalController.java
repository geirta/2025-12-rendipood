package ee.geir.rendipood.controller;

import ee.geir.rendipood.RentalService.RentalService;
import ee.geir.rendipood.dto.RentalFilmDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class RentalController {

    @Autowired
    private RentalService rentalService;

    @PostMapping("start-rental")
    public double startRental(@RequestBody List<RentalFilmDTO> rentalFilms) {
        return rentalService.startRental(rentalFilms);
    }

    @PostMapping("end-rental")
    public double endRental(@RequestBody List<RentalFilmDTO> rentalFilms) {
        return rentalService.endRental(rentalFilms);
    }


}
