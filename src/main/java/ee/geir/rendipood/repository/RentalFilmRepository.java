package ee.geir.rendipood.repository;

import ee.geir.rendipood.entity.RentalFilm;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RentalFilmRepository extends JpaRepository<RentalFilm, Long> {

    RentalFilm findByFilm_IdAndReturnedFalse(Long id);
}
