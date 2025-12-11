package ee.geir.rendipood.util;

import ee.geir.rendipood.entity.Film;
import ee.geir.rendipood.entity.FilmType;
import ee.geir.rendipood.entity.RentalFilm;

public class Calculations {
    private static final double BASIC_PRICE = 3;
    private static final double PREMIUM_PRICE = 4;

    // MARGUS

    public static double initialFee(FilmType filmType, int days){
        return switch(filmType){
            case NEW -> PREMIUM_PRICE * days;
            case REGULAR -> BASIC_PRICE + BASIC_PRICE * Math.max(0, days - 3);
            case OLD -> BASIC_PRICE + BASIC_PRICE * Math.max(0, days - 5);
        };
    }

    public static double lateFee(FilmType filmType, int days){
        return switch(filmType){
            case NEW -> PREMIUM_PRICE * days;
            case REGULAR,
                 OLD -> BASIC_PRICE * days;
        };
    }



    // GEIR

    public static double calculatePrice(FilmType filmType, int days) {

        return switch (filmType) {
            case NEW -> days * PREMIUM_PRICE;
            case REGULAR -> days <= 3 ? BASIC_PRICE : BASIC_PRICE + (days - 3) * BASIC_PRICE;
            case OLD -> days <= 5 ? BASIC_PRICE : BASIC_PRICE + (days - 5) * BASIC_PRICE;
        };
    }

    public static int setDays(Film film, int days) {
        FilmType filmType = film.getType();
        return switch (filmType) {
            case NEW -> days;
            case REGULAR -> days <= 3 ? 3 : days;
            case OLD -> days <= 5 ? 5 : days;
        };
    }

    public static int calculateLateDays(int actualDays, RentalFilm rentalFilm) {
        int lateDays = 0;
        FilmType filmType = rentalFilm.getFilm().getType();
        int initialDays = rentalFilm.getInitialDays();

        if (filmType.equals(FilmType.NEW)) {
            return actualDays - initialDays;
        } else if (filmType.equals(FilmType.REGULAR) && actualDays > 3 && initialDays > 3) {
            return actualDays - initialDays;
        } else if (filmType.equals(FilmType.OLD) && actualDays > 5) {
            return actualDays - initialDays;
        }

        return lateDays;
    }
}

