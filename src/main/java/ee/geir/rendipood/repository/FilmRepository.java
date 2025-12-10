package ee.geir.rendipood.repository;

import ee.geir.rendipood.entity.Film;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FilmRepository extends JpaRepository<Film, Long> {

    List<Film> findByInStock(boolean inStock);

}
