export type FilmType = "NEW" | "REGULAR" | "OLD"

export type Film = {
    id: number,
    name: string,
    type: FilmType,
    inStock: boolean
}