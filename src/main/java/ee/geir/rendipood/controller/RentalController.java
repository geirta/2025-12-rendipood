package ee.geir.rendipood.controller;

import ee.geir.rendipood.RentalService.RentalService;
import ee.geir.rendipood.dto.RentalFilmDTO;
import ee.geir.rendipood.entity.Rental;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
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

    @GetMapping("rentals")
    public List<Rental> getAllRentals() {
        return rentalService.getAllRentals();
    }


}
