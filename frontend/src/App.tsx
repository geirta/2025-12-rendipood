
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer'
import Header from './components/Header'
import Home from './pages/Home'
import Films from './pages/Films'
import Rentals from './pages/Rentals'
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

const getInitialMode = (): 'light' | 'dark' => {
  const saved = localStorage.getItem('theme');
  return saved === 'light' || saved === 'dark' ? saved : 'dark';
};

function App() {

  const [mode, setMode] = useState<'light' | 'dark'>(getInitialMode);
  
  useEffect(() => {
    localStorage.setItem('theme', mode);
  }, [mode]);

  const theme = useMemo(() => 
    createTheme({
        palette: {
          mode,
        },
      }), [mode]
  );

  const toggleTheme = () => {
    setMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <>
      <ThemeProvider theme={theme} >
        <CssBaseline />
        <div className='app'>
          <Header mode={mode} toggleTheme={toggleTheme} />

          <main className='content'>
          <Routes>
            <Route path='/' element={<Home/>}></Route>
            <Route path='/films' element={<Films/>}></Route>
            <Route path='/rentals' element={<Rentals/>}></Route>
          </Routes>
          </main>

          <Footer />
        </div>
      </ThemeProvider>
    </>
  )
}

export default App
