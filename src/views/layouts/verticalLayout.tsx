// @mui
import { Divider, IconButton, styled, Toolbar } from "@mui/material"
import MuiDrawer from '@mui/material/Drawer';

// @next
import { NextPage } from "next"

// @components
import IconifyIcon from "src/components/Icon";

// @Layouts
import ListVerticalLayout from "./listVerticalLayout";

const drawerWidth: number = 240;
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(18),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(18),
                },
            }),
        },
    }),
);


type TProps = {
    open: boolean
    toggleDrawer: () => void
}
const VerticalLayout: NextPage<TProps> = ({ open, toggleDrawer }) => {
    return <>
        <Drawer variant="permanent" open={open}>
            <Toolbar
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    px: [1],
                }}
            >
                <IconButton onClick={toggleDrawer}>
                    <IconifyIcon icon='mingcute:left-line' />
                </IconButton>
            </Toolbar>
            <Divider />
            <ListVerticalLayout open={open} />
        </Drawer>
    </>
}

export default VerticalLayout