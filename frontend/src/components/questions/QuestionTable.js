
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Button } from '@mui/material';
import ErrorMessage from './ErrorMessageDialog'
import QuestionDialog from './QuestionDialog';
import questionService from '../../services/question-service';
import useAuth from '../../hooks/useAuth';

const columns = [
  { id: 'index', label: 'ID', minWidth: 10 },
  { id: 'title', label: 'Title', minWidth: 170 },
  { id: 'difficulty', label: 'Diff Lvl', minWidth: 70 },
  { id: 'topic', label: 'Topic(s)', minWidth: 170 },
  { id: 'status', label: 'Status', minWidth: 100 }
];

export default function QuestionTable({ mountTrigger }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [open, setOpen] = useState(false);
  const [errorOpen, setErrorOpen] = React.useState(false); // State to control error dialog visibility
  const [errorMessage, setErrorMessage] = React.useState(''); // State to store error message
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // Fetch questions from backend when component mounts
  useEffect(() => {
      const fetchQuestions = async () => {
        try {
          const response = await questionService.getAllQuestions(cookies);
          setQuestions(response);
        } catch (error) {
            setErrorMessage(error.message); // Set error message
            setErrorOpen(true); // Open error dialog
        } finally {
            setLoading(false);
        }
      };
      fetchQuestions(); // Trigger the fetch
  }, [mountTrigger]);

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question); 
    setOpen(true);
  };

  const handleErrorClose = () => {
    setErrorOpen(false); // Close the error dialog
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedQuestion(null);
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
            {questions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const rowIndex = index + page * rowsPerPage + 1;
                const isEvenRow = index % 2 === 0;
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex} style={{ backgroundColor: isEvenRow ? '#EBEBEB' : '#F7F7F7' }}>
                    <TableCell style={{color: 'black', fontSize: 20, fontFamily: 'Poppins', fontWeight: '600', wordWrap: 'break-word'}}>{rowIndex}</TableCell>
                    
                    <TableCell>
                      <Button 
                        color="primary" 
                        onClick={() => handleQuestionClick(row)}
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
                        {row.title}
                      </Button>
                    </TableCell>

                    <TableCell 
                      style={{
                        color: 
                          row.difficulty.toLowerCase() === 'easy' ? '#00C000' :
                          row.difficulty.toLowerCase() === 'medium' ? '#FFB800' :
                          row.difficulty.toLowerCase() === 'hard' ? '#EE0000' : 'black',
                        fontSize: 20, 
                        fontFamily: 'Poppins', 
                        fontWeight: '600', 
                        wordWrap: 'break-word'
                      }}
                    >
                      {row.difficulty}
                    </TableCell>
                    
                    <TableCell style={{color: 'black', fontSize: 20, fontFamily: 'Poppins', fontWeight: '600', wordWrap: 'break-word'}}>{row.topic.join(', ')}</TableCell>
                    <TableCell style={{color: 'black', fontSize: 20, fontFamily: 'Poppins', fontWeight: '600', wordWrap: 'break-word'}}>New</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination 
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={questions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <ErrorMessage
        open={errorOpen}
        handleClose={handleErrorClose}
        errorMessage={errorMessage}
      />

      {selectedQuestion && (
        <QuestionDialog 
          open={open}
          question={selectedQuestion} 
          onClose={handleCloseDialog} 
        />
      )}
    </Paper>
  );
}
