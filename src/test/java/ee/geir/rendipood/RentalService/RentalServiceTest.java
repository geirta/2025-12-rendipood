package ee.geir.rendipood.RentalService;

import ee.geir.rendipood.dto.RentalFilmDTO;
import ee.geir.rendipood.entity.Film;
import ee.geir.rendipood.entity.FilmType;
import ee.geir.rendipood.entity.Rental;
import ee.geir.rendipood.entity.RentalFilm;
import ee.geir.rendipood.repository.FilmRepository;
import ee.geir.rendipood.repository.RentalFilmRepository;
import ee.geir.rendipood.repository.RentalRepository;
import ee.geir.rendipood.util.Calculations;
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

    @Mock
    private RentalFilmRepository rentalFilmRepository;

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


    // START RENTAL TESTING
    // START RENTAL TESTING
    // START RENTAL TESTING


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
    void givenFilmIsInStock_whenRentalIsStarted_thenStockStatusIsChangedToFalse() {
        mockSaveFilmToDb(1L, "Pirates of the Caribbean", FilmType.REGULAR, true);

        RentalFilmDTO rentalFilmDTO = getRentalFilmDTO(1L, 1);
        List<RentalFilmDTO> rentalFilmDTOList = new ArrayList<>();
        rentalFilmDTOList.add(rentalFilmDTO);
        rentalService.startRental(rentalFilmDTOList);

        boolean stockStatus = filmRepository.findById(1L).get().getInStock();
        assertEquals(false, stockStatus);
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
    void givenFilmIsRegularAndRentedFor6Days_whenRentalIsStarted_thenInitialFeeIs12() {
        mockSaveFilmToDb(3L, "Matrix", FilmType.REGULAR, true);

        RentalFilmDTO rentalFilmDTO = getRentalFilmDTO(3L, 6);
        List<RentalFilmDTO> rentalFilmDTOList = new ArrayList<>();
        rentalFilmDTOList.add(rentalFilmDTO);

        double sum = rentalService.startRental(rentalFilmDTOList);
        assertEquals(12, sum);
    }

    @Test
    void givenFilmIsNewAndRentedFor6Days_whenRentalIsStarted_thenInitialFeeIs24() {
        mockSaveFilmToDb(3L, "Matrix", FilmType.NEW, true);

        RentalFilmDTO rentalFilmDTO = getRentalFilmDTO(3L, 6);
        List<RentalFilmDTO> rentalFilmDTOList = new ArrayList<>();
        rentalFilmDTOList.add(rentalFilmDTO);

        double sum = rentalService.startRental(rentalFilmDTOList);
        assertEquals(24, sum);
    }

    @Test
    void givenFilmListContains1OutOfStock_whenRentalIsStarted_thenExceptionIsThrown() {
        mockSaveFilmToDb(4L, "Matrix", FilmType.NEW, true);
        mockSaveFilmToDb(5L, "Spiderman 3", FilmType.NEW, false);

        RentalFilmDTO rentalFilmDTO = getRentalFilmDTO(4L, 6);
        RentalFilmDTO rentalFilmDTO2 = getRentalFilmDTO(5L, 6);
        List<RentalFilmDTO> rentalFilmDTOList = new ArrayList<>();
        rentalFilmDTOList.add(rentalFilmDTO);
        rentalFilmDTOList.add(rentalFilmDTO2);

        String message = assertThrows(RuntimeException.class, () -> rentalService.startRental(rentalFilmDTOList)).getMessage();
        assertEquals("Film is not in stock", message);
    }


    // END RENTAL TESTING
    // END RENTAL TESTING
    // END RENTAL TESTING


    @Test
    void giveFilmIsNewAndRentedFor3Days_whenRentalIsEndedIn4Days_thenLateFeeIs4Eur() {
        mockSaveFilmToDb(6L, "Kill Bill", FilmType.NEW, true);

        RentalFilmDTO rentalFilmDTO = getRentalFilmDTO(6L,3);
        List<RentalFilmDTO> rentalFilmDTOList = new ArrayList<>();
        rentalFilmDTOList.add(rentalFilmDTO);
        double sumStart = rentalService.startRental(rentalFilmDTOList);


        RentalFilmDTO rentalFilmDTO2 = getRentalFilmDTO(6L, 5);
        List<RentalFilmDTO> rentalFilmDTOList2 = new ArrayList<>();
        rentalFilmDTOList2.add(rentalFilmDTO2);
        double sumEnd = rentalService.endRental(rentalFilmDTOList2);
        assertEquals(8, sumEnd);
    }

}