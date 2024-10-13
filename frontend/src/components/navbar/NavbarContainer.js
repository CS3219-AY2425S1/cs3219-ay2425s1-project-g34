import { AppBar, Toolbar } from '@mui/material';

export const NavbarContainer = ({ children }) => {
    return (
        <AppBar position="sticky" sx={{ top: 0, backgroundColor: '#61c0f8', zIndex: 999, maxHeight: 75 }}>
            <Toolbar sx={{ justifyContent: 'space-between', padding: '0 20px' }}>
                {children}
            </Toolbar>
        </AppBar>
    );
};
