import * as React from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';


import { NextPage } from 'next';
import VerticalLayout from './verticalLayout';
import HorizontalLayout from './horizontalLayout';

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}







type TProps = {
    children: React.ReactNode
}

const UserLayout: NextPage<TProps> = ({ children }) => {
    const theme = useTheme()
    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            <HorizontalLayout open={open} toggleDrawer={toggleDrawer} />
            <VerticalLayout open={open} toggleDrawer={toggleDrawer} />

            <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Toolbar />
                <Container sx={{
                    m: 4,
                    width: `calc(100% - 32px)`,
                    maxWidth: `calc(100% - 32px) !important`,
                    overflow: 'auto',
                    maxHeight: `calc(100vh - ${theme.mixins.toolbar.minHeight}px - 32px)`,
                    height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px - 32px)`,
                    padding: '0 !important',
                    borderRadius: '15px'
                }}>
                    <Grid container spacing={3}>
                        {children}
                    </Grid>
                    <Copyright sx={{ pt: 4 }} />
                </Container>
            </Box>
        </Box>
    );
}
export default UserLayout