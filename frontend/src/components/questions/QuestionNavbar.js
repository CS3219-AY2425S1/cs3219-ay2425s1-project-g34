import { AppBar, Box, Toolbar, Button } from '@mui/material';
import Logo from '../assets/Logo.png';
import "@fontsource/poppins";

export default function Navbar() {

    const navLinkStyle = {
        fontFamily: 'Poppins',     // Font family: Poppins
        fontSize: '18px',          // Font size: 20px
        fontStyle: 'normal',       // Normal font style
        fontWeight: 600,           // Font weight: 600 (semi-bold)
        textAlign: 'center',       // Center the text
        lineHeight: 'normal',      // Normal line height
        textTransform: 'none',     // Disable Material-UI's default uppercase transform
    };

    return (
    <AppBar position="sticky" sx={{ top: 0, backgroundColor: '#61c0f8', zIndex: 999, maxHeight: 75 }}>
        <Toolbar sx={{ justifyContent: 'center' }}>
        
        <Box sx={{
            left: '10px',
            width: '288px',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center'
        }}>
            <img src={Logo} alt="Logo" style={{ height: 70, cursor: 'pointer' }} />
        </Box>

        <Box sx={{ flexGrow: 1, display: 'flex', gap: 5, maxWidth: '100%' }}>
            <Button color="inherit" sx={{ color: '#000',...navLinkStyle }}>
                Home
            </Button>
            <Button color="inherit" sx={{ color: '#000',...navLinkStyle }}>
                Profile
            </Button>
            <Button color="inherit" sx={{ color: '#000',...navLinkStyle }}>
                History
            </Button>
            <Button color="inherit" sx={{ color: '#FFF', ...navLinkStyle }}>
                Questions
            </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
                variant="contained"
                sx={{
                    width: '126px',
                    height: '45px',
                    flexShrink: 0,
                    backgroundColor: '#8576FF', 
                    fontFamily: 'Poppins', 
                    fontSize: '18px', 
                    fontWeight: 600,
                    textAlign: 'center',
                    lineHeight: 'normal',
                    textTransform: 'none',
                    '&:hover': {
                        backgroundColor: '#915edc',
                    },
                    marginLeft: '15px',
                }}
            >
                Logout
            </Button>
        </Box>
        </Toolbar>
    </AppBar>
    );
}