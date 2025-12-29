import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import type {Film} from '../model/Film'
import { calculatePrice } from '../utils/utils';

import type { CartProduct } from '../model/CartProduct';
import { Box, Button, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';

const backendUrl = import.meta.env.VITE_API_HOST;

function Home() {

  const { t } = useTranslation();
  const [films, setFilms] = useState<Film[]>([])
  
  const [selectedFilmId, setSelectedFilmId] = useState<number | "">("");
  const [rentalDays, setRentalDays] = useState<number>(1);
  const [cart, setCart] = useState<CartProduct[]>(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    if (cart.length === 0) {
      localStorage.removeItem("cart");
    } else {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  useEffect(() => {
    fetch(`${backendUrl}/films`)
      .then(res => res.json())
      .then(json => setFilms(json))
  }, []);

  const loadFilms = () => {
    fetch(`${backendUrl}/films`)
      .then(res => res.json())
      .then(json => setFilms(json))
      .catch(console.error);
  };

  useEffect(() => {
    loadFilms();
  }, []);

  const startRental = () => {
    if (cart.length === 0)
      return;

    const preppedFilms = cart.map(item => ({
      filmId: item.film.id,
      days: item.days
    }));

    fetch(`${backendUrl}/start-rental`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(preppedFilms)
    })
      .then(res => {
        if (!res.ok) throw Error("Failed to start rental");
        return res.json();
      })
      .then((totalFee: number) => {
        // alert(`Rental started! Total fee: ${totalFee}`);
        toast.success(`Rental started! Total fee: ${totalFee}`)
        setCart([]);
        loadFilms();
      })
      .catch(e => console.error(e));

  };

  async function addToCart(selectedFilmToAddId: number | "", rentalDays: number) {
    if (selectedFilmToAddId === "" || rentalDays < 1) return;

    const filmToAdd = films.find(f => f.id === selectedFilmToAddId);
    if (!filmToAdd || !filmToAdd.inStock) return;

    const price = await calculatePrice(filmToAdd.id, rentalDays);

    setCart(prev => {
      const existing = prev.find(c => c.film.id === filmToAdd.id);
      if (existing) {
        return prev.map(item =>
          item.film.id === filmToAdd.id
          ? { ...item, days: rentalDays, price }
          : item
        );
      }
      return [...prev, {film: filmToAdd, days: rentalDays, price }];
    });
    setSelectedFilmId("");
    setRentalDays(1);
  }


  return (

    <div className='container'>
      <Grid container spacing={2} rowSpacing={4}>
        <Grid size={{ xs: 12, sm: 8, md: 4 }}>
          <Stack spacing={2}>
            <h2>{t('home.startRental.title')}</h2>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="film-label">{t('home.startRental.film')}</InputLabel>
                <Select
                labelId="film-label"
                  id="filmName"
                  value={selectedFilmId}
                  label={t('home.startRental.film')}
                  onChange={e => setSelectedFilmId(Number(e.target.value))}
                >
                  {films.map(film => (
                    <MenuItem key={film.id} value={film.id} disabled={!film.inStock}>
                      {film.name} {!film.inStock && " - OUT OF STOCK"}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
                
            <Box sx={{ minWidth: 120 }}>
              <TextField
                label={t('home.startRental.days')}
                type="number"
                value={rentalDays} 
                onChange={e => setRentalDays(Number(e.target.value))}
                inputProps={{
                  min: 1,
                  max: 30,
                }}
                fullWidth
              />
            </Box>
            <Box sx={{ minWidth: 120 }}>
              <Button variant="contained" size="large" 
                onClick={() => addToCart(selectedFilmId, rentalDays)}
                disabled={selectedFilmId === ""}
              >
                {t('home.startRental.addFilmBtn')}
              </Button>
            </Box>
          </Stack>
        </Grid>

        <Grid size={12}>
          <Stack spacing={2}>
            <h2>{t('home.selectedMovies.title')}</h2>
            <form>
              <Stack spacing={2}>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 150 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell align="left">{t('home.selectedMovies.name')}</TableCell>
                        <TableCell align="left">{t('home.selectedMovies.days')}</TableCell>
                        <TableCell align="left">{t('home.selectedMovies.price')}</TableCell>
                        <TableCell align="left"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cart.map((item) => (
                        <TableRow
                          key={item.film.id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">{item.film.id}</TableCell>
                          <TableCell align="left">{item.film.name}</TableCell>
                          <TableCell align="left">{item.days}</TableCell>
                          <TableCell align="left">{item.price.toFixed(2)}€</TableCell>
                          <TableCell align="left">
                            <IconButton aria-label="delete" color="warning"
                              onClick={() => 
                                setCart(prev =>
                                  prev.filter(c => c.film.id !== item.film.id)
                              )}
                              disabled={cart.length === 0}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                        
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box sx={{ minWidth: 120 }}>
                  <Button variant="contained" size="large" type="button" onClick={startRental} disabled={cart.length === 0}>
                    {t('home.selectedMovies.startRentalBtn')}
                  </Button>
                </Box>
              </Stack>
            </form>
          </Stack>
        </Grid>
      </Grid>
    </div>
  )
}

export default Home
