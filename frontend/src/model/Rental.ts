export type Rental = {
    id: number,
    initialFee: number,
    lateFee: number,
    complete: boolean,
    rentalFilms: {
        id: number;
        returned: boolean;
        film: {
        id: number;
        name: string;
        }
    }[]
}