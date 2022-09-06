import { Accordion, AccordionDetails, AccordionSummary, Button, IconButton, Link, TextField, ToggleButton, ToggleButtonGroup, Typography, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import allGames from '../data/all-games.json';
import { upperFirst } from '../util';

import './all-games.css';
import { useContext, useState, useEffect } from "react";
import { GameStatusContext } from "../contexts/game-status";

function AllGames() {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const gameStatus = useContext(GameStatusContext);
  const [searchFilter, setSearchFilter] = useState('');
  const [platformFilter, setPlatformFilter] = useState('any');
  const [statusFilter, setStatusFilter] = useState(['new']);

  const [filteredGames, setFilteredGames] = useState<any[]>([]);

  useEffect(() => {
    window.onbeforeunload = () => gameStatus.save();
  }, [gameStatus])

  const updateFilter = useEffect(() => {
    setFilteredGames(getFiltered(searchFilter, platformFilter, statusFilter, gameStatus));
  }, [searchFilter, platformFilter, statusFilter, gameStatus])

  const handleSearchChange = (evt: any) => {
    setSearchFilter(evt.target.value);
  };

  const handlePlatformChange = (event: any, newPlatform: string) => {
    setPlatformFilter(newPlatform);
  };

  const handleStatusChange = (event: any, newStatus: string[]) => {
    setStatusFilter(newStatus);
  };
  
  const columns = [{
    field: 'name',
    headerName: 'Name',
    flex: 1,
  }, {
    field: 'platforms',
    headerName: 'Platforms',
    flex: 1,
    renderCell: PlatformCell
  }, {
    field: 'controls',
    headerName: '',
    flex: 1,
    renderCell: ControlsCell,
  }];

  return <div className="all-games-page">
    <Accordion disableGutters defaultExpanded={!smallScreen}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="filters-content"
        id="filters-header"
        sx={{marginBottom: 0}}
      >
        <Typography>Filters</Typography>
      </AccordionSummary>
      <AccordionDetails className="filters">
        <TextField placeholder="Search" variant="filled" size="small" hiddenLabel
          value={searchFilter}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <SearchIcon fontSize="small" />,
          }}
        />

        <ToggleButtonGroup
          color="primary"
          aria-label="Status"
          value={statusFilter}
          size='small'
          onChange={handleStatusChange}
        >
          <ToggleButton value="new">New</ToggleButton>
          <ToggleButton value="played">Played</ToggleButton>
          <ToggleButton value="ignored">Ignored</ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup
          color="primary"
          exclusive
          aria-label="Platform"
          value={platformFilter}
          size='small'
          onChange={handlePlatformChange}
        >
          <ToggleButton value="any">Any</ToggleButton>
          <ToggleButton value="Web">Web</ToggleButton>
          <ToggleButton value="Android">Android</ToggleButton>
          <ToggleButton value="IOS">iOS</ToggleButton>
          <ToggleButton value="Steam">Steam</ToggleButton>
          <ToggleButton value="Windows">Windows</ToggleButton>
        </ToggleButtonGroup>
      </AccordionDetails>
    </Accordion>

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

function PlatformCell({row}: {row: any}) {
  return <span className="platform-cell">
    {Object.entries(row.platforms).map(([key, value]) => 
      <Link
        href={(value as any).link}
        target="_blank"
        rel="noreferrer"
        key={key}
      >{upperFirst(key)}</Link>
    )}
  </span>;
}

function ControlsCell({row}: {row: any}) {
  const gameStatus = useContext(GameStatusContext);
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return <div className="controls-cell">
    {smallScreen ? <>
      <IconButton
        size="small"
        color="primary"
        onClick={() => gameStatus.markGameAsPlayed(row.id)}
      >
        <CheckRoundedIcon />
      </IconButton>
      <IconButton
        size="small"
        color="error"
        onClick={() => gameStatus.markGameAsIgnored(row.id)}
      >
        <VisibilityOffIcon />
      </IconButton>
    </> :
    <>
      <Button
        variant="outlined"
        startIcon={<CheckRoundedIcon />}
        size="small"
        onClick={() => gameStatus.markGameAsPlayed(row.id)}
      >Played</Button>
      <Button
        variant="outlined"
        startIcon={<VisibilityOffIcon />}
        size="small"
        color="error"
        onClick={() => gameStatus.markGameAsIgnored(row.id)}
      >Ignore</Button>
    </>}
  </div>;
}

function getFiltered(search: string, platform: string, statuses: string[], gameStatus: GameStatusContext) {
  return allGames.filter(ag => {
    const nameMatches = search ? ag.name.includes(search) : true;
    const platformMatches = platform == 'any' || Object.keys(ag.platforms).includes(platform);
    let statusMatches = false;
    const isPlayed = gameStatus.playedGames.includes(ag.id);
    const isIgnored = gameStatus.ignoredGames.includes(ag.id);
    if (statuses.includes('new')) {
      statusMatches = statusMatches || (!isPlayed && !isIgnored);
    }
    if (statuses.includes('played')) {
      statusMatches = statusMatches || isPlayed;
    }
    if (statuses.includes('ignored')) {
      statusMatches = statusMatches || isIgnored;
    }

    return nameMatches && platformMatches && statusMatches;
  })
}