import { Button, Link, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SearchIcon from "@mui/icons-material/Search";

import allGames from '../data/all-games.json';
import { upperFirst } from '../util';

import './all-games.css';
import { Stack } from "@mui/system";
import { useState } from "react";

function AllGames() {
  const [platformFilter, setPlatformFilter] = useState('any');

  const handlePlatformChange = (event, newPlatform) => {
    setPlatformFilter(newPlatform);
  };
  
  const columns = [{
    field: 'name',
    headerName: 'Name',
    flex: 1,
  }, {
    field: 'platforms',
    headerName: 'Platforms/Links',
    flex: 1,
    renderCell: PlatformCell
  }, {
    field: 'controls',
    headerName: '',
    flex: 1,
    renderCell: ControlsCell,
  }];

  return <div className="all-games-page">
    <Typography variant="h4" component="h2" marginBottom={2}>All Games</Typography>

    <Stack direction="row" spacing={2} marginBottom={2} height={40}>
      <TextField placeholder="Search" variant="filled" size="small" hiddenLabel
        InputProps={{
          startAdornment: <SearchIcon fontSize="small" />,
        }}
      />

      <ToggleButtonGroup
        color="primary"
        exclusive
        aria-label="Platform"
        value={platformFilter}
        onChange={handlePlatformChange}
      >
        <ToggleButton value="any">Any</ToggleButton>
        <ToggleButton value="web">Web</ToggleButton>
        <ToggleButton value="android">Android</ToggleButton>
        <ToggleButton value="ios">iOS</ToggleButton>
        <ToggleButton value="steam">Steam</ToggleButton>
        <ToggleButton value="windows">Windows</ToggleButton>
      </ToggleButtonGroup>
    </Stack>

    <div className="game-table">
      <DataGrid
        disableColumnFilter

        columns={columns}
        rows={allGames}
      />
    </div>
  </div>;
}

export default AllGames;

function PlatformCell({row}) {
  return <span className="platform-cell">
    {Object.entries(row.platforms).map(([key, value]) => 
      <Link
        href={value.link}
        target="_blank"
        rel="noreferrer"
        key={key}
      >{upperFirst(key)}</Link>
    )}
  </span>;
}

function ControlsCell({row}) {
  return <div className="controls-cell">
    <Button
      variant="outlined"
      startIcon={<CheckRoundedIcon />}
      size="small"
    >Played</Button>
    <Button
      variant="outlined"
      startIcon={<VisibilityOffIcon />}
      size="small"
      color="error"
    >Ignore</Button>
  </div>;
}