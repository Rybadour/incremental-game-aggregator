import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';

import './App.css';

import allGames from './data/all-games.json';
import { upperFirst } from './util';
import { AppBar, Divider, Drawer, FormControlLabel, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Switch, ToggleButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenu = () => {
    setIsMenuOpen(true);
  };

  const handleClose = () => {
    setIsMenuOpen(false);
  };

  const columns = [{
    field: 'name',
    headerName: 'Name',
    flex: 1,
  }, {
    field: 'style',
    headerName: 'Game Style',
    flex: 1,
  }, {
    field: 'features',
    headerName: 'Features',
    flex: 1,
    valueFormatter: ({value}) => {
      return value.join(', ');
    }
  }, {
    field: 'platforms',
    headerName: 'Platforms/Links',
    flex: 1,
    renderCell: PlatformCell
  }];

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
                <ListItem disablePadding>
                  <Switch />
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
        <div className="game-table">
          <DataGrid
            checkboxSelection={true}
            columns={columns}
            rows={allGames}
          />
        </div>
      </div>
    </div>
  );
};

function PlatformCell({row}) {
  return <span>
    {Object.entries(row.platforms).map(([key, value]) => 
      <a
        href={value.link}
        target="_blank"
        rel="noreferrer"
        key={key}
      >{upperFirst(key)}</a>
    )}
  </span>;
}

export default App;