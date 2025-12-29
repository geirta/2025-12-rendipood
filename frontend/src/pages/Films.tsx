import { useEffect, useState } from 'react'
import '../App.css'
import type {Film, FilmType} from '../model/Film'
import { useTranslation } from 'react-i18next';
import { Box, Button, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import Paper from '@mui/material/Paper';
import { toast } from 'react-toastify';

const backendUrl = import.meta.env.VITE_API_HOST;

function Films() {
  const FILM_TYPES: FilmType[] = ["NEW", "REGULAR", "OLD"];
  const [films, setFilms] = useState<Film[]>([])
  const [filmName, setFilmName] = useState("")
  const [filmType, setFilmType] = useState<FilmType | "">("");
  const { t } = useTranslation();
  const [editingFilmId, setEditingFilmId] = useState<number | null>(null)

  useEffect(() => {
    fetch(`${backendUrl}/films`)
      .then(res => res.json())
      .then(json => setFilms(json))
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    fetch(`${backendUrl}/films`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
          name: filmName,
          type: filmType,
          inStock: true
      })
    })
    .then(res => {
        if (!res.ok) {
          toast.error("Failed to save film");  
          throw new Error("Failed to save film");
        }
        return res.json();
    })
    .then((updatedFilms: Film[]) => {
        setFilms(updatedFilms);
        setFilmName("");
        setFilmType("");
    })
    .catch(err => console.error(err));
  };

  const handleDelete = (id: number) => {
    console.log("Deleting film ID:", id);
    fetch(`${backendUrl}/films/${id}`, {
        method: "DELETE" 
    })
        .then(res => {
            console.log("Response:", res);
            if (!res.ok) throw new Error("Failed to delete film");
            setFilms(prev => prev.filter(film => film.id !== id));
            toast.success(`Film deleted!`)
        })
        .catch(err => console.error(err));
  };

    const handleTypeChange = (id: number, newType: FilmType) => {
        fetch(`${backendUrl}/films-type?id=${id}&type=${newType}`, {
            method: "PATCH" 
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to update film type");
                return res.json();
            })
            .then((updatedFilms: Film[]) => {
                setEditingFilmId(null);
                setFilms(updatedFilms);
            })
            .catch(err => console.error(err));
    };

    const cancelEdit = () => {
      setEditingFilmId(null);
    };


  return (
    <>
      <div className='container'>
          <Grid container spacing={2} rowSpacing={4}>
              <Grid size={{ xs: 12, sm: 8, md: 4 }}>
                <Stack spacing={2}>
                  <h2>{t('films.addFilm.title')}</h2>
                  <form onSubmit={handleSave}>
                    <Stack spacing={2}>
                      <Box sx={{ minWidth: 120 }}>
                          <TextField
                              label={t('films.addFilm.name')}
                              value={filmName} 
                              onChange={e => setFilmName(e.target.value)}
                              inputProps={{
                              min: 1,
                              max: 30,
                              }}
                              fullWidth
                          />
                      </Box>

                      <Box sx={{ minWidth: 120 }}>
                          <FormControl fullWidth>
                          <InputLabel id="film-type">{t('films.addFilm.type')}</InputLabel>
                          <Select
                              labelId="film-type"
                              id="filmName"
                              value={filmType}
                              label={t('films.addFilm.type')}
                              onChange={e => setFilmType(e.target.value as FilmType)}
                          >
                              {FILM_TYPES.map(type => (
                              <MenuItem key={type} value={type}>
                                  {t(`films.filmType.${type}`)}
                              </MenuItem>
                              ))}
                          </Select>
                          </FormControl>
                      </Box>

                      <Box sx={{ minWidth: 120 }}>
                          <Button type="submit" variant="contained" size="large">
                          {t('films.addFilm.button')}
                          </Button>
                      </Box>
                    </Stack>
                  </form>
                </Stack>
              </Grid>
              <Grid size={12}>
                <h2>{t('films.title')}</h2>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 150 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell align="left">{t('films.header.filmName')}</TableCell>
                        <TableCell align="left">{t('films.header.filmType')}</TableCell>
                        <TableCell align="left">{t('films.header.inStock')}</TableCell>
                        <TableCell align="left">{t('films.header.actions')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {films.map((film) => (
                        <TableRow
                          key={film.id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">{film.id}</TableCell>
                          <TableCell align="left">{film.name}</TableCell>
                          <TableCell align="left">
                            <Box sx={{ minWidth: 120 }}>
                              <FormControl fullWidth>
                                <InputLabel id="film-type">{t('films.addFilm.type')}</InputLabel>
                                <Select
                                    labelId="film-type"
                                    id="filmType"
                                    value={film.type}
                                    label={t('films.addFilm.type')}
                                    onChange={e => handleTypeChange(film.id, e.target.value as FilmType)}
                                    disabled={editingFilmId !== film.id}
                                >
                                    {FILM_TYPES.map(type => (
                                    <MenuItem key={type} value={type}>
                                        {t(`films.filmType.${type}`)}
                                    </MenuItem>
                                    ))}
                                </Select>
                              </FormControl>
                          </Box>
                          </TableCell>
                          <TableCell align="left">{t(`films.inStock.${film.inStock}`)}</TableCell>
                          <TableCell align="left">
                            <IconButton aria-label="edit" color="warning"
                              onClick={() => editingFilmId === film.id ? cancelEdit() : setEditingFilmId(film.id)}
                            >
                              {editingFilmId === film.id ? <CancelIcon /> : <EditIcon />}
                            </IconButton>
                            <IconButton aria-label="delete" color="warning"
                              onClick={() => handleDelete(film.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                        
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
          </Grid>
      </div>
    </>
  )
}

export default Films
