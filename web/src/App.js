import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { AppBar, Divider, Drawer, FormControlLabel, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Switch, ToggleButton, Toolbar, Typography, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import './App.css';
import AllGames from './components/all-games';
import { GameStatusProvider } from './contexts/game-status';

const ColorModeContext = React.createContext({ mode: 'dark', toggleColorMode: () => {} });

const App = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState(prefersDarkMode ? 'dark' : 'light');
  const colorMode = React.useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [mode],
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBody />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

function AppBody() {
  const colorMode = React.useContext(ColorModeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenu = () => {
    setIsMenuOpen(true);
  };

  const handleClose = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="app">
      <AppBar position="static">
        <Toolbar variant="dense">
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              id="menu-appbar"
              anchor="left"
              keepMounted
              PaperProps={{style: {minWidth: 200}}}
              open={isMenuOpen}
              onClose={handleClose}
            >
              <List>
                {['All Games', 'Your Games'].map((text, index) => (
                  <ListItem key={text} disablePadding>
                    <ListItemButton>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <Divider />
              <List>
                {['FAQ'].map((text, index) => (
                  <ListItem key={text} disablePadding>
                    <ListItemButton>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                ))}
                <ListItem>
                  <FormControlLabel control={
                    <Switch checked={colorMode.mode == 'dark'} onChange={colorMode.toggleColorMode} />
                  } label="Dark Mode" />
                </ListItem>
              </List>
            </Drawer>
          </div>

          <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1 }}>
            Incremental Game Aggregator
          </Typography>
        </Toolbar>
      </AppBar>

      <div className="app-body">
        <GameStatusProvider>
          <AllGames />
        </GameStatusProvider>
      </div>
    </div>
  );
}

export default App;