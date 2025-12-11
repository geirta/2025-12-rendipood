package ee.geir.rendipood.RentalService;

import ee.geir.rendipood.dto.RentalFilmDTO;
import ee.geir.rendipood.entity.Film;
import ee.geir.rendipood.entity.FilmType;
import ee.geir.rendipood.repository.FilmRepository;
import ee.geir.rendipood.repository.RentalRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
class RentalServiceTest {

    // given_when_then
    // eeltingimused_misK2ivitatakse_misOnTulemus

    @Mock
    private FilmRepository filmRepository;

    @Mock
    private RentalRepository rentalRepository;

    @InjectMocks
    private RentalService rentalService;

    @BeforeEach
    void setUp() {
//        mockSaveFilmToDb(1L, "Pirates of the Caribbean", FilmType.REGULAR, false);
//        mockSaveFilmToDb(2L, "Fast and furious", FilmType.OLD, true);
//        mockSaveFilmToDb(3L, "Matrix", FilmType.REGULAR, true);
//        mockSaveFilmToDb(4L, "Spiderman 3", FilmType.NEW, true);
//        mockSaveFilmToDb(5L, "Avengers 2", FilmType.NEW, true);
    }

    private void mockSaveFilmToDb(Long id, String name, FilmType filmType, boolean inStock) {
        Film film = new Film();
        film.setId(id);
        film.setName(name);
        film.setType(filmType);
        film.setInStock(inStock);
        when(filmRepository.findById(id)).thenReturn(Optional.of(film));
    }

    private static RentalFilmDTO getRentalFilmDTO(Long id, int days) {
        RentalFilmDTO rentalFilmDTO = new RentalFilmDTO();
        rentalFilmDTO.setFilmId(id);
        rentalFilmDTO.setDays(days);
        return rentalFilmDTO;
    }

    @Test
    void givenFilmIsNotInStock_whenRentalIsStarted_thenExceptionIsThrown() {
        mockSaveFilmToDb(1L, "Pirates of the Caribbean", FilmType.REGULAR, false);

        RentalFilmDTO rentalFilmDTO = getRentalFilmDTO(1L, 0);
        List<RentalFilmDTO> rentalFilmDTOList = new ArrayList<>();
        rentalFilmDTOList.add(rentalFilmDTO);

        String message = assertThrows(RuntimeException.class, () -> rentalService.startRental(rentalFilmDTOList)).getMessage();
        assertEquals("Film is not in stock", message);
    }

    @Test
    void givenFilmIsOldAndRentedFor5Days_whenRentalIsStarted_thenInitialFeeIs3() {
        mockSaveFilmToDb(2L, "Fast and furious", FilmType.OLD, true);

        RentalFilmDTO rentalFilmDTO = getRentalFilmDTO(2L, 5);
        List<RentalFilmDTO> rentalFilmDTOList = new ArrayList<>();
        rentalFilmDTOList.add(rentalFilmDTO);

        double sum = rentalService.startRental(rentalFilmDTOList);
        assertEquals(3, sum);
    }


    @Test
    void endRental() {
    }
}