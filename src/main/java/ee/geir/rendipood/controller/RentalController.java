package ee.geir.rendipood.controller;

import ee.geir.rendipood.dto.RentalFilmDTO;
import ee.geir.rendipood.entity.Film;
import ee.geir.rendipood.entity.Rental;
import ee.geir.rendipood.entity.RentalFilm;
import ee.geir.rendipood.repository.FilmRepository;
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

    @PostMapping("start-rental")
    public double startRental(@RequestBody List<RentalFilmDTO> rentalFilms) {

        double sum = 0;
        List<Film> films = new ArrayList<>();
        List<RentalFilm> rentalFilmList = new ArrayList<>();

        for (RentalFilmDTO rentalFilmDTO : rentalFilms) {
            Film film = filmRepository.findById(rentalFilmDTO.getFilmId()).orElseThrow();
            film.setInStock(false);
            films.add(film);

            // siin ehitan valmis RentalFilm entity mudelit
            RentalFilm rentalFilm = new RentalFilm();
            rentalFilm.setFilm(film);
            rentalFilm.setInitialDays(rentalFilmDTO.getDays());
            rentalFilm.setLateDays(0);
            rentalFilmList.add(rentalFilm);

            sum += Calculations.calculatePrice(film.getType(), rentalFilmDTO.getDays());

            // TODO: KOJU :: arvuta hind vastavalt tüübile ja võetud päevadele
            // TODO: KOJU :: arvuta hind vastavalt tüübile ja võetud päevadele
            // TODO: KOJU :: arvuta hind vastavalt tüübile ja võetud päevadele

        }
        filmRepository.saveAll(films);
        Rental rental = new Rental();
        rental.setInitialFee(sum);
        rental.setLateFee(0);
        rental.setRentalFilms(rentalFilmList); // RentalFilm entity .save abil andmebaasi t2nu CascadeType.ALL reale
        return sum;
    }

    // TODO: KOJU :: arvuta hind vastavalt tüübile ja võetud päevadele
    // TODO: KOJU :: arvuta hind vastavalt tüübile ja võetud päevadele
    // TODO: KOJU :: arvuta hind vastavalt tüübile ja võetud päevadele

    // end-rental -> FilmID + tegelikud rendip2evad

    @PostMapping("end-rental")
    public double endRental() {
        return 0;
    }
}
