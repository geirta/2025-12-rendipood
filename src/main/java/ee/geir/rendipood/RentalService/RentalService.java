package ee.geir.rendipood.RentalService;

import ee.geir.rendipood.dto.PriceRequest;
import ee.geir.rendipood.dto.PriceResponse;
import ee.geir.rendipood.dto.RentalFilmDTO;
import ee.geir.rendipood.entity.Film;
import ee.geir.rendipood.entity.Rental;
import ee.geir.rendipood.entity.RentalFilm;
import ee.geir.rendipood.repository.FilmRepository;
import ee.geir.rendipood.repository.RentalFilmRepository;
import ee.geir.rendipood.repository.RentalRepository;
import ee.geir.rendipood.util.Calculations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RentalService {

    @Autowired
    private RentalRepository rentalRepository;
    @Autowired
    private FilmRepository filmRepository;
    @Autowired
    private RentalFilmRepository rentalFilmRepository;

    public double startRental(List<RentalFilmDTO> rentalFilms) {
        double sum = 0;
        List<Film> films = new ArrayList<>();
        List<RentalFilm> rentalFilmList = new ArrayList<>();
        Rental rental = new Rental();

        for (RentalFilmDTO rentalFilmDTO : rentalFilms) {
            Film film = filmRepository.findById(rentalFilmDTO.getFilmId()).orElseThrow();
            if (!film.getInStock()) {
                throw new RuntimeException("Film is not in stock");
            }
            film.setInStock(false);
            films.add(film);

            RentalFilm rentalFilm = getRentalFilm(rentalFilmDTO, film, rental);
            rentalFilmList.add(rentalFilm);

            double filmRentalPrice = Calculations.calculatePrice(film.getType(), rentalFilmDTO.getDays());
            sum += filmRentalPrice;
        }
        filmRepository.saveAll(films);
        saveRental(rental, sum, rentalFilmList);
        return sum;
    }

    private void saveRental(Rental rental, double sum, List<RentalFilm> rentalFilmList) {
        rental.setInitialFee(sum);
        rental.setLateFee(0);
        rental.setRentalFilms(rentalFilmList); // RentalFilm entity .save abil andmebaasi t2nu CascadeType.ALL reale
        rentalRepository.save(rental);
    }

    private RentalFilm getRentalFilm(RentalFilmDTO rentalFilmDTO, Film film, Rental rental) {
        RentalFilm rentalFilm = new RentalFilm();
        rentalFilm.setFilm(film);
        rentalFilm.setInitialDays(rentalFilmDTO.getDays());
        rentalFilm.setLateDays(0);
        rentalFilm.setRental(rental);
        return rentalFilm;
    }



    public double endRental(List<RentalFilmDTO> rentalFilms) {
        double sum = 0;
        List<Film> films = new ArrayList<>();
        List<RentalFilm> rentalFilmsList = new ArrayList<>();
        List<Rental> rentals = new ArrayList<>();

        for (RentalFilmDTO dto: rentalFilms){
            Film film = filmRepository.findById(dto.getFilmId()).orElseThrow();
            film.setInStock(true);
            films.add(film);

            RentalFilm rentalFilm = getRentalFilm(dto, rentalFilmsList);

            Rental rental = rentalRepository.findById(rentalFilm.getRental().getId()).orElseThrow();

            sum += Calculations.lateFee(film.getType(), rentalFilm.getLateDays());
            rental.setLateFee(rental.getLateFee() + sum);
            rentals.add(rental);
        }
        filmRepository.saveAll(films);
        rentalRepository.saveAll(rentals);
        rentalFilmRepository.saveAll(rentalFilmsList);
        return sum;
    }

    public boolean areAllFilmsReturned(Long rentalId) {
        return !rentalFilmRepository.existsByRental_IdAndReturnedFalse(rentalId);
    }

    public double returnOneFilm(RentalFilmDTO dto) {
        double sum = 0;

        Film film = filmRepository.findById(dto.getFilmId()).orElseThrow();
        film.setInStock(true);
        filmRepository.save(film);

        RentalFilm rentalFilm = rentalFilmRepository.findByFilm_IdAndReturnedFalse(dto.getFilmId());
        int lateDays = Math.max(0, dto.getDays() - rentalFilm.getInitialDays());
        rentalFilm.setLateDays(lateDays);
        rentalFilm.setReturned(true);
        rentalFilmRepository.save(rentalFilm);

        Rental rental = rentalRepository.findById(rentalFilm.getRental().getId()).orElseThrow();
        sum += Calculations.lateFee(film.getType(), rentalFilm.getLateDays());
        rental.setLateFee(rental.getLateFee() + sum);
        if (areAllFilmsReturned(rental.getId())) {
            rental.setComplete(true);
        }
        rentalRepository.save(rental);

        return sum;
    }

    private RentalFilm getRentalFilm(RentalFilmDTO dto, List<RentalFilm> rentalFilmsList) {
        RentalFilm rentalFilm = rentalFilmRepository.findByFilm_IdAndReturnedFalse(dto.getFilmId());
        int lateDays = Math.max(0, dto.getDays() - rentalFilm.getInitialDays());
        rentalFilm.setLateDays(lateDays);
        rentalFilm.setReturned(true);
        rentalFilmsList.add(rentalFilm);
        return rentalFilm;
    }

    public List<Rental> getAllRentals() {
        return rentalRepository.findAll();
    }

    public PriceResponse calculateFilmPrice(PriceRequest priceRequest) {
        Film film = filmRepository.findById(priceRequest.filmId())
                .orElseThrow(() -> new RuntimeException("Film Not Found"));
        double price = Calculations.calculatePrice(film.getType(), priceRequest.days());
        return new PriceResponse(price);
    }
}
