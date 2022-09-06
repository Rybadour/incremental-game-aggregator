import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { AppBar, Dialog, DialogContent, DialogTitle, Divider, Drawer, FormControlLabel, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Switch, ToggleButton, Toolbar, Typography, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import './App.css';
import AllGames from './components/all-games';
import { GameStatusProvider } from './contexts/game-status';
import { Stack } from '@mui/system';

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
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  const openMenu = () => {
    setIsMenuOpen(true);
  };
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const openFaq = () => {
    setIsFaqOpen(true);
  };
  const closeFaq = () => {
    setIsFaqOpen(false);
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
              onClick={openMenu}
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
              onClose={closeMenu}
            >
              <List>
                <ListItem disablePadding>
                  <ListItemButton onClick={openFaq}>
                    <ListItemText primary="FAQ" />
                  </ListItemButton>
                </ListItem>
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

      <FaqDialog
        isOpen={isFaqOpen}
        onClose={closeFaq}
      />
    </div>
  );
}

function FaqDialog({isOpen, onClose}) {
  return <Dialog onClose={onClose} open={isOpen}>
    <DialogTitle>FAQ</DialogTitle>
    <DialogContent>
      <Stack spacing={3}>
        <div>
          <Typography variant="h6" component="div">What is this?</Typography>
          <Typography variant="p" component="p" ml={1}>
            This website is a list of incremental games extracted from various sources such as Reddit.
          </Typography>
        </div>

        <div>
          <Typography variant="h6" component="div">Why?</Typography>
          <Typography variant="p" component="p" ml={1}>
            I wanted a complete list of incremental games that was unbiased and automatically generated. Also a site that
            has a few reasonable filters and a way to sort through games you've already played.
          </Typography>
        </div>

        <div>
          <Typography variant="h6" component="div">How is the list generated?</Typography>
          <Typography variant="p" component="p" ml={1}>
            Currently, Reddit is the only source. I run a script that uses the Reddit API to download recent posts and it
            tries to find links that point to incremental games on a variety of platforms. The raw data extracted is pretty
            rough so I need to manually update it before committing it to the master list.
          </Typography>
        </div>

        <div>
          <Typography variant="h6" component="div">Why isn't a game listed here?</Typography>
          <Typography variant="p" component="p" ml={1}>
            The process isn't perfect and it's possible something will get missed. If you find a post or comment that you
            believe wasn't processed correctly please let me know so I can fix it. (/u/salbris on Reddit)

            Ultimately, adding games to this list is up to my discretion but I want to be fair. I plan to only remove games
            that contain forced ads, severly manipulative game design, or are very early in development.
          </Typography>
        </div>
      </Stack>
    </DialogContent>
  </Dialog>;
}

export default App;