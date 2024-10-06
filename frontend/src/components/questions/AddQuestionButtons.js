import * as React from 'react';
import { useState } from 'react';
import { Button } from '@mui/material';
import CreateQuestion from './CreateQuestionDialog';

const AddQuestionButton = () => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button
                variant="contained"
                onClick={handleClickOpen} // Opens the dialog on button click
                sx={{
                    width: '200px',
                    height: '54px',
                    flexShrink: 0,
                    backgroundColor: '#443CBD', 
                    fontFamily: 'Poppins', 
                    fontSize: '18px', 
                    fontWeight: 600,
                    textAlign: 'center',
                    lineHeight: 'normal',
                    textTransform: 'none',
                    '&:hover': {
                        backgroundColor: '#915edc',
                    },
                    marginTop: '10px',
                }}
            >
                Add Question
            </Button>
            <CreateQuestion 
                open={open} 
                handleClose={handleClose} />
        </div>
    );
}

export default AddQuestionButton;