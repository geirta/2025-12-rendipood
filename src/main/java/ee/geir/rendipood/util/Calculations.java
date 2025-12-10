package ee.geir.rendipood.util;

import ee.geir.rendipood.entity.FilmType;

public class Calculations {

    public static double calculatePrice(FilmType filmType, int days) {
        final double BASIC_PRICE = 3;
        final double PREMIUM_PRICE = 4;

        return switch (filmType) {
            case NEW -> days * PREMIUM_PRICE;
            case REGULAR -> days <= 3 ? BASIC_PRICE : BASIC_PRICE + (days - 3) * BASIC_PRICE;
            case OLD -> days <= 5 ? BASIC_PRICE : BASIC_PRICE + (days - 5) * BASIC_PRICE;
        };

    }
}

