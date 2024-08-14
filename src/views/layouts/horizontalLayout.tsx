
import { NextPage } from "next"

// @mui
import { Badge, Button, IconButton, styled, Toolbar, Typography } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import IconifyIcon from "src/components/Icon";
import ModeToggle from "./components/mode-toggle";
import { useAuth } from "src/hooks/useAuth";
import { useRouter } from "next/router";
import UserDropdown from "./components/user-dropdown";
import LanguageDropdown from "./components/language-dropdown";

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: prop => prop !== 'open'
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor:
        theme.palette.mode === 'light' ? theme.palette.customColors.lightPaperBg : theme.palette.customColors.darkPaperBg,
    color: theme.palette.primary.main,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    })
}))

type TProps = {
    open: boolean
    toggleDrawer: () => void,
    isHideMenu?: boolean
}
const HorizontalLayout: NextPage<TProps> = ({ open, toggleDrawer, isHideMenu }) => {
    const { user } = useAuth()
    const router = useRouter()

    return <>
        <AppBar position="absolute" open={open}>
            <Toolbar
                sx={{
                    pr: '24px', // keep right padding when drawer closed
                }}
            >
                {!isHideMenu && (
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer}
                        sx={{
                            marginRight: '36px',
                            ...(open && { display: 'none' }),
                        }}

                    >                    <IconifyIcon icon='ic:round-menu' />
                    </IconButton>
                )}

                <Typography
                    component="h1"
                    variant="h6"
                    color="inherit"
                    noWrap
                    sx={{ flexGrow: 1 }}
                >
                    Dashboard
                </Typography>
                <LanguageDropdown />
                <ModeToggle />
                {user ? (
                    <UserDropdown />
                ) : (
                    <Button variant='contained' sx={{ ml: 2, width: 'auto' }} onClick={() => router.push("/login")}>
                        Sign In
                    </Button>
                )}
            </Toolbar>
        </AppBar >
    </>
}

export default HorizontalLayout