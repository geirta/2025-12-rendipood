export type RentalFilm = {
  id: number,
  initialDays: number,
  lateDays: number,
  returned: boolean,
  film: {
    id: number,
    name: string
  },
  rental: {
    id: number
  }
}