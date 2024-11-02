import axios from 'axios';
import { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Button } from '@mui/material';
import questionService from '../../services/question-service';
import userService from '../../services/user-service';
import useAuth from "../../hooks/useAuth";

const columns = [
  { id: 'index', label: 'ID', minWidth: 10 },
  { id: 'question', label: 'Question', minWidth: 170 },
  { id: 'partner', label: 'Partner', minWidth: 80 },
  { id: 'status', label: 'Status', minWidth: 50 },
  { id: 'datetime', label: 'Date/Time', minWidth: 80 }
];

export default function HistoryTable() {
  const { userId, cookies } = useAuth();
  const [history, setHistory] = useState([]);
  const [currentHistory, setCurrentHistory] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  useEffect(() => {
    const fetchUserHistory = async () => {
      const user = await userService.getUserById(userId, cookies.token);
      const { data } = await axios.post(`http://localhost:3004/bulk`, {
        "ids": user.history,
        withCredentials: true,
      });

      setHistory(data.data);
    };

    userId && fetchUserHistory().catch(err => console.error(err));
  }, [userId, cookies]);

  useEffect(() => { // updates table whenever page and/or rowsperpage changes
    const updatedCurrentHistory = new Array(rowsPerPage);
    Promise.all(history
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map(async (each, index) => {
        updatedCurrentHistory[index] = {
          index: index + page * rowsPerPage + 1,
          question: await questionService.getQuestionById(each.question, cookies),
          partner: await userService.getUserById(each.partner, cookies.token),
          status: each.status,
          datetime: each.datetime,
        };
      })).then(() => setCurrentHistory(updatedCurrentHistory));

  }, [page, rowsPerPage, history]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ maxHeight: 440, maxWidth: '1200px', margin: 'auto' }}>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, backgroundColor: '#1C1678', color: 'white', fontSize: 20, fontFamily: 'Poppins', fontWeight: '600', wordWrap: 'break-word'}}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentHistory
              .map((row, index) => {
                const isEvenRow = index % 2 === 0;
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.index} style={{ backgroundColor: isEvenRow ? '#EBEBEB' : '#F7F7F7' }}>
                    
                    <TableCell style={{color: 'black', fontSize: 20, fontFamily: 'Poppins', fontWeight: '600', wordWrap: 'break-word'}}>
                      {row.index}
                    </TableCell>

                    <TableCell>
                      <Button 
                        color="primary" 
                        onClick={() => null}
                        disableRipple
                        sx={{
                          fontSize: '20px', 
                          fontFamily: 'Poppins', 
                          fontWeight: '600',
                          textTransform: 'none',
                          textDecoration: 'underline',
                          color: '#41AFFF',
                          padding: 0,
                          minWidth: 0,
                          textAlign: 'left',
                          '&:hover': {
                            backgroundColor: 'transparent',
                            textDecoration: 'underline',
                          }
                        }}>
                        {row.question.title}
                      </Button>
                    </TableCell>

                    <TableCell style={{color: 'black', fontSize: 20, fontFamily: 'Poppins', fontWeight: '600', wordWrap: 'break-word'}}>
                      {row.partner.username}
                    </TableCell>

                    <TableCell 
                      style={{
                        color: 
                          row.status.toLowerCase() === 'attempted' ? '#FFB800' :
                          row.status.toLowerCase() === 'solved' ? '#00C000' : 'black',
                        fontSize: 20, 
                        fontFamily: 'Poppins', 
                        fontWeight: '600', 
                        wordWrap: 'break-word'
                      }}
                    >
                      {row.status}
                    </TableCell>
                    
                    <TableCell style={{color: 'black', fontSize: 20, fontFamily: 'Poppins', fontWeight: '600', wordWrap: 'break-word'}}>
                      {row.datetime}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination 
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={history.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}