import { Box, Typography } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Header = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '2rem' }}>
            <Typography component="h4" variant="h4" sx={{ fontStyle: 'bold' }}><strong>♟ CryptoChess</strong></Typography>
            <ConnectButton />
        </Box>
    )
}

export default Header;