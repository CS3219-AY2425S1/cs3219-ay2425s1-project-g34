import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/Logo.png';

export const NavbarLogo = () => {
    const navigate = useNavigate();
    return (
        <Box
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => navigate('/home')}
        >
            <img src={Logo} alt="Logo" style={{ height: 70 }} />
        </Box>
    );
};