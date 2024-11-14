import { Button } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

export const NavbarLink = ({ text, path }) => {
    const location = useLocation();

    const navLinkStyle = {
        color: location.pathname === path ? '#fff' : '#000',  // Active link color white, others black
        fontFamily: 'Poppins',
        fontSize: '18px',
        fontWeight: 600,
        textAlign: 'center',
        lineHeight: 'normal',
        textTransform: 'none',
        textDecoration: 'none',
        padding: '8px 15px',
    };

    return (
        <Button sx={{ padding: 0, margin: 0 }}>
            <Link to={path} style={navLinkStyle}>
                {text}
            </Link>
        </Button>
    );
};
