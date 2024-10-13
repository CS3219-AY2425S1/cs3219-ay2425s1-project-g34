import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import ErrorMessage from './ErrorMessageDialog'
import questionService from '../../services/question-service';
import useAuth from '../../hooks/useAuth';

export default function DeleteQuestion({ question }) {
  const { cookies } = useAuth();

  const [open, setOpen] = React.useState(false);
  const [errorOpen, setErrorOpen] = React.useState(false); // State to control error dialog visibility
  const [errorMessage, setErrorMessage] = React.useState(''); // State to store error message

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleErrorClose = () => {
    setErrorOpen(false); // Close the error dialog
  };

  const handleDelete = async () => {
    try {
      await questionService.deleteQuestion(question._id, cookies); // Call delete function from the service
      setOpen(false); // Close the dialog after deletion
      window.location.reload(); // Optionally refresh the page after deletion
    } catch (error) {
      setErrorMessage(error.message); // Set error message
      setErrorOpen(true); // Open error dialog
    }
  };

  return (
    <React.Fragment>
      <Button 
        variant="contained"
        onClick={handleClickOpen} // Opens the dialog on button click
        sx={{
            backgroundColor: '#F82929', 
            fontFamily: 'Poppins', 
            fontWeight: 400,
            '&:hover': {
                backgroundColor: '#B20000',
            },
        }}>
            Delete
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-question-dialog-title"
        aria-describedby="delete-dialog-description"
        PaperProps={{
            style: {
            width: '400px', // Fixed width for the popup
            height: '208px', // Fixed height for the popup
            },
        }}
      >
        <DialogTitle id="delete-question-dialog-title" style={{color: 'black', fontFamily: 'Poppins', fontWeight: '800', wordWrap: 'break-word', textAlign: 'center'}}>
          {"YOU ARE ABOUT TO DELETE THE QUESTION"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-question-dialog-description" style = {{fontWeight: 'bold', fontFamily: 'Poppins', wordWrap: 'break-word', textAlign: 'center'}}>
            Deleting the question is an irreversible action and results
            in data being lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            variant="contained"
            onClick={handleClose}
            sx={{
                backgroundColor: '#41AFFF', 
                fontFamily: 'Poppins', 
                fontWeight: 400,
                '&:hover': {
                    backgroundColor: '#414EFF',
                },
            }}>
            Back</Button>
          <Button 
            variant="contained"
            onClick={handleDelete}
            autoFocus 
            sx={{
                backgroundColor: '#F82929', 
                fontFamily: 'Poppins', 
                fontWeight: 400,
                '&:hover': {
                    backgroundColor: '#B20000',
                },
            }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <ErrorMessage
                open={errorOpen}
                handleClose={handleErrorClose}
                errorMessage={errorMessage}
            />
    </React.Fragment>
  );
}
