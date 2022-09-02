import { Link } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import allGames from '../data/all-games.json';
import { upperFirst } from '../util';


function AllGames() {
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
    <div className="game-table" >
      <DataGrid
        checkboxSelection={true}
        columns={columns}
        rows={allGames}
      />
    </div>
  );
}

export default AllGames;

function PlatformCell({row}) {
  return <span>
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