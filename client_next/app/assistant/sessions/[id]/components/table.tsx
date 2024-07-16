"use client"

import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { styled } from '@mui/material/styles';
import { BackIcon } from '../../page';
import { useRouter } from 'next/navigation';



export type RequestTableType = {
    id: number;
    session_id?: string;
    date?: string;
    order?: string;
    open?:() => React.ReactNode;
    melanomaId?: string;
    ai_risk?: string;
    finished?: boolean;
    moleImage?: string;
    location?: string;
}




type Order = 'asc' | 'desc';


export interface HeadCell {
    disablePadding: boolean;
    id: keyof RequestTableType;
    label: string;
    numeric: boolean;
}



interface EnhancedTableProps {
    numSelected: number;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    rowCount: number;
    headCells: readonly HeadCell[];
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, numSelected, rowCount, headCells } =
    props;
 
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: theme.palette.common.black,
          color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
        },
      }));
      
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    }));

return (
<TableHead>
    <StyledTableRow>
        <StyledTableCell padding="checkbox">
        <Checkbox
            color="success"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
            'aria-label': 'select all requests',
            }}
        />
        </StyledTableCell >
        {headCells.map((headCell) => (
        <StyledTableCell
            key={headCell.id}
            align={headCell.numeric ? 'center' : 'center'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
        >
            {headCell.label}
        </StyledTableCell>
        ))}
    </StyledTableRow>
</TableHead>
);
}



function EnhancedTableToolbar({numSelected,handleAccept,tableTitle,isOrderReady,handleFinish,type}:{numSelected:number,handleAccept:() => void;tableTitle:string | undefined;isOrderReady?:boolean;handleFinish:(arg:boolean) => void;type:"req" | "mole"}){


  const router = useRouter()

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%', fontWeight: '650',fontSize:22,opacity:1}}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {tableTitle}
        </Typography>
      )}
      {numSelected > 0 ? (
        <>
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <div onClick={() => handleAccept()} style={{width:120,height:40,background:"lightgreen",position:"absolute",flexDirection:"column",justifyContent:"center",alignItems:"center",display:"flex",borderRadius:5,right:80,cursor:"pointer"}}>
            <h4 style={{fontSize:14}}>Accept</h4>
        </div>
        </>
      ) : (
        <>
     
        <Tooltip title="Filter list">
          <IconButton>
            <BackIcon handleBack={() => router.back()} />
          </IconButton>
        </Tooltip>
        {type == "mole" && (
          isOrderReady ?
          <div onClick={() => handleFinish(false)} className="finishButton" style={{position:"relative",background:"rgba(255,0,0,0.4)",boxShadow:"0px 0px 0px 2px red",opacity:0.8}} >
              <h4 style={{color:"black",fontWeight:"800"}}>Not Ready</h4>
          </div>
          :
          <div onClick={() => handleFinish(true)} className="finishButton" style={{position:"relative"}} >
            <h4 style={{color:"black",fontWeight:"800"}}>Finsih</h4>
          </div>
        )
        }
        </>
      )}
    </Toolbar>
  );
}
export default function EnhancedTable({
    rows,
    handleAccept,
    headCells,
    type,
    tableTitle,
    isOrderReady,
    handleFinish
    }: {
    rows: RequestTableType[];
    handleAccept:(selected:any[]) => void;
    headCells: readonly HeadCell[];
    type: "req" | "mole";
    tableTitle?:string;
    isOrderReady?:boolean;
    handleFinish:(arg:boolean) => void;
}) {

  const [selected, setSelected] = React.useState< any[]>([]);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
const StyledTableRow = styled(TableRow)(({ theme }) => ({
'&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
},
// hide last border
'&:last-child td, &:last-child th': {
    border: 0,
},
}));


  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected:  number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    console.log(newSelected)
    setSelected(newSelected);
  };


  const isSelected = (id: number) => selected.indexOf(id) !== -1;


  return (
    <Box sx={{ width: '100%',height:"100%" }}>
      <Paper sx={{ width: '100%', mb: 2,height:"100%" }}>
        <EnhancedTableToolbar numSelected={selected.length} handleAccept={() => handleAccept(selected)} tableTitle={tableTitle} isOrderReady={isOrderReady} handleFinish={(e:boolean) => handleFinish(e)} type={type} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750,height:"100%" }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={rows.length}
              headCells={headCells}
            />
            <TableBody>
              {rows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <StyledTableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    {type == "req" ? 
                    <>
                      <StyledTableCell padding="checkbox">
                        <Checkbox
                          onClick={(event) => handleClick(event, row.id)}
                          color="success"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </StyledTableCell>
                      <StyledTableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.session_id}
                      </StyledTableCell>
                      <StyledTableCell align="right" >{row.date}</StyledTableCell>
                      <StyledTableCell align="right" >{row.order}</StyledTableCell>
                      <StyledTableCell width={100}  align="right">{row.open && row.open()}</StyledTableCell>
                    </>
                    :
                    <>
                    <StyledTableCell width={100} style={{width:250,border:"1px solid black"}}  align="center">{row.open && row.open()}</StyledTableCell>
                    <StyledTableCell
                      component="div"
                      style={{display:"flex",alignItems:"center", flexDirection:"row",marginTop:0,marginLeft:0,border:"1px solid black"}}
                      id={labelId}
                      scope="row"
                    >
                      <img src={row.moleImage} alt="sds" style={{width:70,height:70,marginRight:5,borderRadius:5}} />
                      <h4 style={{marginLeft:10}}>{row.melanomaId}</h4>
                    </StyledTableCell>
                    <StyledTableCell style={{fontWeight:"600",border:"1px solid black"}} align="center" >{row.location}</StyledTableCell>
                    <StyledTableCell style={{fontWeight:"600",minWidth:150,border:"1px solid black"}}align="center" >{row.ai_risk}</StyledTableCell>
                    <StyledTableCell width={150} align="center" style={row.finished ?{backgroundColor:"rgba(0,255,0,0.3)",minWidth:130,border:"1px solid black"}:{backgroundColor:"rgba(255,0,0,0.3)",minWidth:150,border:"1px solid black"}} ><h5>{!row.finished ? "Not finishhed yet" : "Sent to Client"}</h5></StyledTableCell>
                    </>
                    }
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
