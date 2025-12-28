import { Link } from "react-router-dom";
// JavaScripti: useNavigate
// HTMLi: Link, Route, Routes

import { useTranslation } from 'react-i18next';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import LanguageIcon from '@mui/icons-material/Language';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const pages = ['Films', 'Rentals'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

type HeaderProps = {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
};

const Header = ({mode, toggleTheme}: HeaderProps) => {
    const { t, i18n } = useTranslation();

    function updateLanguage(newLang: string) {
        i18n.changeLanguage(newLang);
        localStorage.setItem("language", newLang);
    }

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (

        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
            
                <Typography
                    variant="h6"
                    noWrap
                    component="a"
                    sx={{
                    mr: 2,
                    display: { xs: 'none', md: 'flex' },
                    fontFamily: 'Roboto',
                    fontWeight: 700,
                    letterSpacing: '0.1 rem',
                    color: 'inherit',
                    textDecoration: 'none',
                    }}
                >
                    <Link className='navbar-brand' to="/">{t('header.storeName')}</Link>
                </Typography>

                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                    <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                    >
                    <MenuIcon />
                    </IconButton>
                    <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{ display: { xs: 'block', md: 'none' } }}
                    >
                        <MenuItem onClick={handleCloseNavMenu}>
                        <Typography sx={{ textAlign: 'center' }}><Link className='nav-link' aria-current="page" to="/films">{t('header.films')}</Link></Typography>
                        </MenuItem>

                        <MenuItem onClick={handleCloseNavMenu}>
                        <Typography sx={{ textAlign: 'center' }}><Link className='nav-link' aria-current="page" to="/rentals">{t('header.rentals')}</Link></Typography>
                        </MenuItem>
                    </Menu>
                </Box>
                <Typography
                    variant="h5"
                    noWrap
                    component="a"
                    href="#app-bar-with-responsive-menu"
                    sx={{
                    mr: 2,
                    display: { xs: 'flex', md: 'none' },
                    flexGrow: 1,
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    color: 'inherit',
                    textDecoration: 'none',
                    }}
                >
                    {t('header.storeName')}
                </Typography>
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    <Link className='nav-link' aria-current="page" to="/films">
                        <Button
                            onClick={handleCloseNavMenu}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            {t('header.films')}
                        </Button>
                    </Link>
                    <Link className='nav-link' aria-current="page" to="/rentals">
                        <Button
                            onClick={handleCloseNavMenu}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            {t('header.rentals')}
                        </Button>
                    </Link>
                </Box>

                <Box sx={{ flexGrow: 0 }}>
                    <Tooltip title="Change language">
                    <IconButton 
                        onClick={handleOpenUserMenu} sx={{ p: 0 }}
                        color="inherit"
                    >
                        <LanguageIcon />
                    </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                        >
                        <MenuItem onClick={() => updateLanguage("et")}>
                            <Typography sx={{ textAlign: 'center' }}>ET</Typography>
                        </MenuItem>
                        <MenuItem onClick={() => updateLanguage("en")}>
                            <Typography sx={{ textAlign: 'center' }}>EN</Typography>
                        </MenuItem>
                    </Menu>
                </Box>

                <Box sx={{ flexGrow: 0 }}>
                    <IconButton color="inherit" onClick={toggleTheme}>
                        {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton>
                </Box>

                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default Header