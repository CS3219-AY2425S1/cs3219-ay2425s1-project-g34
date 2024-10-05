import React from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { NavbarContainer } from './NavbarContainer';
import { NavbarLogo } from './NavbarLogo';
import { NavbarLink } from './NavbarLink';
import { NavbarButton } from './NavbarButton';

export default function GeneralNavbar() {
    const navigate = useNavigate();
    const [cookies, removeCookie] = useCookies(["token"]);

    const handleLogout = () => {
        removeCookie("token");
        navigate("/login");
    };

    return (
        <NavbarContainer>
            {/* Left Side: Logo */}
            <NavbarLogo />

            {/* Middle: Navigation Links */}
            <Box sx={{ display: 'flex', gap: 3, flexGrow: 1, alignItems: 'center', marginLeft: '30px' }}>
                <NavbarLink text="Home" path="/home" />
                <NavbarLink text="Profile" path="/profile" />
                <NavbarLink text="History" path="/history" />
                <NavbarLink text="Questions" path="/questions" />
            </Box>

            {/* Right Side: Logout Button */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <NavbarButton
                    onClick={handleLogout}
                    color="#8576FF"
                    textColor="#fff"
                    hoverColor="#6a4bcf"
                >
                    Logout
                </NavbarButton>
            </Box>
        </NavbarContainer>
    );
}
