import * as React from 'react';
import { useState } from 'react';
import { Button } from '@mui/material';

const refreshIcon = (
    <svg 
        id="Layer_1"
        width='40'
        height='40'
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 119.4 122.88">
        <title>Reload Table</title>
        <path d="M83.91,26.34a43.78,43.78,0,0,0-22.68-7,42,42,0,0,0-24.42,7,49.94,49.94,0,0,0-7.46,6.09,42.07,42.07,0,0,0-5.47,54.1A49,49,0,0,0,30,94a41.83,41.83,0,0,0,18.6,10.9,42.77,42.77,0,0,0,21.77.13,47.18,47.18,0,0,0,19.2-9.62,38,38,0,0,0,11.14-16,36.8,36.8,0,0,0,1.64-6.18,38.36,38.36,0,0,0,.61-6.69,8.24,8.24,0,1,1,16.47,0,55.24,55.24,0,0,1-.8,9.53A54.77,54.77,0,0,1,100.26,108a63.62,63.62,0,0,1-25.92,13.1,59.09,59.09,0,0,1-30.1-.25,58.45,58.45,0,0,1-26-15.17,65.94,65.94,0,0,1-8.1-9.86,58.56,58.56,0,0,1,7.54-75,65.68,65.68,0,0,1,9.92-8.09A58.38,58.38,0,0,1,61.55,2.88,60.51,60.51,0,0,1,94.05,13.3l-.47-4.11A8.25,8.25,0,1,1,110,7.32l2.64,22.77h0a8.24,8.24,0,0,1-6.73,9L82.53,43.31a8.23,8.23,0,1,1-2.9-16.21l4.28-.76Z" fill='white'/>
    </svg>
);


const RefreshTableButton = ({ trigger }) => {
    return (<>
        <Button
            variant="contained"
            onClick={trigger} // Opens the dialog on button click
            sx={{
                width: '54px',
                height: '54px',
                flexShrink: 0,
                backgroundColor: '#443CBD',
                '&:hover': {
                    backgroundColor: '#915edc',
                },
                marginTop: '10px',
            }}
        >
            {refreshIcon}
        </Button>
    </>);
}

export default RefreshTableButton;