import * as React from 'react';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import '../../styles/create-question-dialog.css';
import { alignProperty } from '@mui/material/styles/cssUtils';

const ErrorMessage = ({ open, handleClose, errorMessage }) => {
  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      PaperProps={{
        style: {
        width: '350px', // Fixed width for the popup
        height: '240px', // Fixed height for the popup
        },
    }}>
      <DialogTitle className="dialog-title">OOPS! SOMETHING WENT WRONG</DialogTitle>
      <DialogContent className='dialog-content'>
        <p>{errorMessage}</p>
      </DialogContent>
      <DialogActions>
      <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            marginBottom: '10px'
          }}
        >
          <Button variant="contained"
              onClick={handleClose}
              sx={{
                  backgroundColor: '#F82929', 
                  fontFamily: 'Poppins', 
                  fontWeight: 400,
                  '&:hover': {
                      backgroundColor: '#B20000',
                  },
                  width: '75%',
              }}>
            Close
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorMessage;