package ee.geir.rendipood.entity;

public enum Price {
    PREMIUM_PRICE(4),
    BASIC_PRICE(3);

    private final double price;

    Price(double price) {
        this.price = price;
    }

    public double getPrice() {
        return price;
    }

}
