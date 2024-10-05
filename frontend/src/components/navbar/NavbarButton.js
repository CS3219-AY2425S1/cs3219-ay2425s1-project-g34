import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

export const NavbarButton = ({ to, onClick, children, color, hoverColor, textColor = '#000' }) => {
    const buttonStyles = {
        backgroundColor: color,
        color: textColor,
        width: '126px',
        fontFamily: 'Poppins',
        fontSize: '18px',
        fontWeight: 600,
        padding: '8px 10px',
        textTransform: 'none',
        boxShadow: 'none',
        '&:hover': {
            backgroundColor: hoverColor,
        },
    };

    return (
        <Button 
            variant="contained" 
            sx={buttonStyles}
            onClick={onClick}
        >
            {to ? (
                <Link to={to} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {children}
                </Link>
            ) : (
                children
            )}
        </Button>
    );
};
