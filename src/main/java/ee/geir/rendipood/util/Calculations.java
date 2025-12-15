package ee.geir.rendipood.util;

import ee.geir.rendipood.entity.FilmType;

public class Calculations {
    private static final double BASIC_PRICE = 3;
    private static final double PREMIUM_PRICE = 4;

    public static double lateFee(FilmType filmType, int days){
        return switch(filmType){
            case NEW -> PREMIUM_PRICE * days;
            case REGULAR,
                 OLD -> BASIC_PRICE * days;
        };
    }

    public static double calculatePrice(FilmType filmType, int days) {
        return switch (filmType) {
            case NEW -> days * PREMIUM_PRICE;
            case REGULAR -> days <= 3 ? BASIC_PRICE : BASIC_PRICE + (days - 3) * BASIC_PRICE;
            case OLD -> days <= 5 ? BASIC_PRICE : BASIC_PRICE + (days - 5) * BASIC_PRICE;
        };
    }
}

