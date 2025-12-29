import { useEffect, useState } from 'react'
import type { Rental } from '../model/Rental';
import type {Film} from '../model/Film'
import { useTranslation } from 'react-i18next';
import '../App.css'
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { toast } from 'react-toastify';

const backendUrl = import.meta.env.VITE_API_HOST;


function Rentals() {

  const { t } = useTranslation();
  const [films, setFilms] = useState<Film[]>([])
  const [rentals, setRentals] = useState<Rental[]>([])
  const [selectedFilmId, setSelectedFilmId] = useState<number | "">("");
  const [actualDays, setActualDays] = useState<number>(1);

  useEffect(() => {
    fetch(`${backendUrl}/rentals`)
      .then(res => res.json())
      .then(json => setRentals(json))
  }, []);

  useEffect(() => {
    fetch(`${backendUrl}/films`)
      .then(res => res.json())
      .then(json => setFilms(json))
  }, []);

  async function returnFilm(selectedFilmToReturnId: number | "", actualDays: number) {
    if (selectedFilmToReturnId === "" || actualDays < 1) return;

    const response = await fetch(`${backendUrl}/return-one-film`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        filmId: selectedFilmToReturnId,
        days: actualDays
      })
    });

    if (!response.ok) {
      throw new Error("Failed to return film");
    }

    const lateFee = await response.json();
    toast.success(
      lateFee > 0
      ? `Returned film! Fee: ${lateFee.toFixed(2)}€`
      : `Returned film! No late fee charged!`
    );

    const [filmsRes, rentalsRes] = await Promise.all([
      fetch(`${backendUrl}/films`),
      fetch(`${backendUrl}/rentals`)
    ]);

    setFilms(await filmsRes.json());
    setRentals(await rentalsRes.json());

    setSelectedFilmId("");
    setActualDays(1);
  }

  return (
    <div className='container'>

      <Grid container spacing={2} rowSpacing={4}>
        <Grid size={{ xs: 12, sm: 8, md: 4 }}>
          <Stack spacing={2}>
            <h2>{t('rentals.return')}</h2>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="film-label">{t('rentals.filmName')}</InputLabel>
                <Select
                  labelId="film-label"
                    id="filmName"
                    value={selectedFilmId}
                    onChange={e => setSelectedFilmId(Number(e.target.value))}
                    label={t('rentals.filmName')}
                >
                  {films
                    .filter(film => !film.inStock)
                    .map(film => (
                      <MenuItem key={film.id} value={film.id}>
                        {film.name}
                      </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
                
            <Box sx={{ minWidth: 120 }}>
              <TextField
                type="number"
                label={t('rentals.days')}
                value={actualDays}
                onChange={e => setActualDays(Number(e.target.value))}
                inputProps={{
                  min: 1
                }}
                fullWidth
              />
            </Box>
            <Box sx={{ minWidth: 120 }}>
              <Button variant="contained" size="large" onClick={() => returnFilm(selectedFilmId, actualDays)}>
                {t('rentals.returnBtn')}
              </Button>
            </Box>
          </Stack>
        </Grid>

        <Grid size={12}>
          <h2>{t('rentals.active')}</h2>
          <TableContainer component={Paper}>
              <Table sx={{ minWidth: 150 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell align="left">{t('rentals.initialFee')}</TableCell>
                    <TableCell align="left">{t('rentals.lateFee')}</TableCell>
                    <TableCell align="left">{t('rentals.films')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rentals
                    .filter(rental => !rental.complete)
                    .map((rental) => (
                    <TableRow
                      key={rental.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">{rental.id}</TableCell>
                      <TableCell align="left">{rental.initialFee}</TableCell>
                      <TableCell align="left">{rental.lateFee}</TableCell>
                      <TableCell align="left">
                        {rental.rentalFilms
                          .map(rf => (
                          <div key={rf.id}>
                            {rf.returned ? <s>{rf.film.name}</s> : rf.film.name}
                          </div>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
        </Grid>

        <Grid size={12}>
          <h2>{t('rentals.returned')}</h2>
          <TableContainer component={Paper}>
              <Table sx={{ minWidth: 150 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell align="left">{t('rentals.initialFee')}</TableCell>
                    <TableCell align="left">{t('rentals.lateFee')}</TableCell>
                    <TableCell align="left">{t('rentals.films')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rentals
                    .filter(rental => rental.complete)
                    .map((rental) => (
                    <TableRow
                      key={rental.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">{rental.id}</TableCell>
                      <TableCell align="left">{rental.initialFee}</TableCell>
                      <TableCell align="left">{rental.lateFee}</TableCell>
                      <TableCell align="left">
                        {rental.rentalFilms.map(rf => (
                          <div key={rf.id}>
                            {rf.film.name}
                          </div>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
        </Grid>
      </Grid>
    </div>
  )
}

export default Rentals
