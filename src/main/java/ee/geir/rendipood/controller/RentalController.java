package ee.geir.rendipood.controller;

import ee.geir.rendipood.RentalService.RentalService;
import ee.geir.rendipood.dto.PriceRequest;
import ee.geir.rendipood.dto.PriceResponse;
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

    @PostMapping("calculate-cart-film")
    public PriceResponse calculate(@RequestBody PriceRequest priceRequest) {
        return rentalService.calculateFilmPrice(priceRequest);
    }

    @PostMapping("start-rental")
    public double startRental(@RequestBody List<RentalFilmDTO> rentalFilms) {
        return rentalService.startRental(rentalFilms);
    }

    @PostMapping("end-rental")
    public double endRental(@RequestBody List<RentalFilmDTO> rentalFilms) {
        return rentalService.endRental(rentalFilms);
    }

    @PostMapping("return-one-film")
    public double returnOneFilm(@RequestBody RentalFilmDTO rentalFilm) {
        return rentalService.returnOneFilm(rentalFilm);
    }

    @GetMapping("rentals")
    public List<Rental> getAllRentals() {
        return rentalService.getAllRentals();
    }


}
