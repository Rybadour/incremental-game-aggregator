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
import { useEffect } from "react";

function AllGames() {
  const [searchFilter, setSearchFilter] = useState('');
  const [platformFilter, setPlatformFilter] = useState('any');
  const [statusFilter, setStatusFilter] = useState(['new']);

  const [filteredGames, setFilteredGames] = useState(getFiltered(searchFilter, platformFilter, statusFilter));

  const updateFilter = useEffect(() => {
    setFilteredGames(getFiltered(searchFilter, platformFilter, statusFilter));
  }, [searchFilter, platformFilter, statusFilter])

  const handleSearchChange = (evt) => {
    setSearchFilter(evt.target.value);
  };

  const handlePlatformChange = (event, newPlatform) => {
    setPlatformFilter(newPlatform);
  };

  const handleStatusChange = (event, newStatus) => {
    setStatusFilter(newStatus);
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

    <div className="filters">
      <TextField placeholder="Search" variant="filled" size="small" hiddenLabel
        value={searchFilter}
        onChange={handleSearchChange}
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
        <ToggleButton value="Web">Web</ToggleButton>
        <ToggleButton value="Android">Android</ToggleButton>
        <ToggleButton value="IOS">iOS</ToggleButton>
        <ToggleButton value="Steam">Steam</ToggleButton>
        <ToggleButton value="Windows">Windows</ToggleButton>
      </ToggleButtonGroup>

      <ToggleButtonGroup
        color="primary"
        aria-label="Status"
        value={statusFilter}
        onChange={handleStatusChange}
      >
        <ToggleButton value="new">New</ToggleButton>
        <ToggleButton value="played">Played</ToggleButton>
        <ToggleButton value="ignored">Ignored</ToggleButton>
      </ToggleButtonGroup>
    </div>

    <div className="game-table">
      <DataGrid
        disableColumnFilter

        columns={columns}
        rows={filteredGames}
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

function getFiltered(search, platform, statuses) {
  return allGames.filter(ag => {
    const nameMatches = search ? ag.name.includes(search) : true;
    const platformMatches = platform == 'any' || Object.keys(ag.platforms).includes(platform);
    const statusMatches = true;

    return nameMatches && platformMatches && statusMatches;
  })
}