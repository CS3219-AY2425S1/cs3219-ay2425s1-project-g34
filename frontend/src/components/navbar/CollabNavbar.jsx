import React from 'react';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import TimerIcon from '@mui/icons-material/Timer';
import { Box } from '@mui/material';
import { NavbarContainer } from './NavbarContainer';
import { NavbarLogo } from './NavbarLogo';
import { NavbarButton } from './NavbarButton';

export default function CollabNavbar({ partnerUsername, countdown, handleSubmit, handleQuit }) {
    const username = partnerUsername;
    const remainingTime = countdown;

    return (
        <NavbarContainer>
            {/* Left Side: Logo */}
            <NavbarLogo />

            {/* Middle: username and timer */}
            <Box sx={{ display: 'flex', gap: 5, flexGrow: 1, alignItems: 'center', marginLeft: '30px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PeopleAltIcon style={{ color: '#000' }} />
                    <p style={{ color: '#000', fontSize: '1.2rem', fontWeight: 'bold' }}>{username}</p>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TimerIcon style={{ color: '#000' }} />
                    <p style={{ color: '#000', fontSize: '1.2rem', fontWeight: 'bold' }}>{remainingTime}</p>
                </Box>
            </Box>

            {/* Right Side: Submit and Quit Buttons */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <NavbarButton
                    onClick={handleSubmit}
                    color="#A3FFD6" // Green color for submit
                    textColor="#000"
                    hoverColor="#388E3C"
                >
                    Submit
                </NavbarButton>
                <NavbarButton
                    onClick={handleQuit}
                    color="#FF8888" // Red color for quit
                    textColor="#000"
                    hoverColor="#D32F2F"
                >
                    Quit
                </NavbarButton>
            </Box>
        </NavbarContainer>
    );
}
