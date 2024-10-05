import { Box } from '@mui/material';
import { NavbarContainer } from '../navbar/NavbarContainer';
import { NavbarLogo } from '../navbar/NavbarLogo';
import { NavbarButton } from '../navbar/NavbarButton';

export default function AuthNavbar() {
    return (
        <NavbarContainer>
            {/* Left Side: Logo */}
            <NavbarLogo />

            {/* Right Side: Sign Up and Login buttons */}
            <Box sx={{ display: 'flex', gap: 5 }}>
                <NavbarButton
                    to="/signup"
                    color="#A3FFD6"
                    textColor="#1C1678"
                    hoverColor="#5fe0d0"
                >
                    Sign Up
                </NavbarButton>
                
                <NavbarButton
                    to="/login"
                    color="#8576FF"
                    textColor="#fff"
                    hoverColor="#6a4bcf"
                >
                    Login
                </NavbarButton>
            </Box>
        </NavbarContainer>
    );
}
