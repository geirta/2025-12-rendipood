package ee.geir.rendipood.util;

import ee.geir.rendipood.entity.FilmType;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CalculationsTest {

    @Test
    void lateFee_newFilm() {
        double lateFee = Calculations.lateFee(FilmType.NEW, 5);
        assertEquals(20, lateFee);
    }

    @Test
    void lateFee_regularFilm() {
        double lateFee = Calculations.lateFee(FilmType.REGULAR, 5);
        assertEquals(15, lateFee);
    }

    @Test
    void lateFee_oldFilm() {
        double lateFee = Calculations.lateFee(FilmType.OLD, 5);
        assertEquals(15, lateFee);
    }

    @Test
    void calculatePrice_newFilm() {
        double price = Calculations.calculatePrice(FilmType.NEW, 7);
        assertEquals(28, price);
    }

    @Test
    void calculatePrice_regularFilm() {
        double price = Calculations.calculatePrice(FilmType.REGULAR, 7);
        assertEquals(15, price);
    }

    @Test
    void calculatePrice_oldFilm() {
        double price = Calculations.calculatePrice(FilmType.OLD, 7);
        assertEquals(9, price);
    }

}