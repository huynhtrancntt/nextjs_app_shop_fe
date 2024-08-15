

import Image from 'next/image';

// @mui
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
// import PersonAdd from '@mui/icons-material/PersonAdd';
// import Settings from '@mui/icons-material/Settings';
// import Logout from '@mui/icons-material/Logout';
import { useState } from 'react';
import { Avatar, Box } from '@mui/material';

// @Components
import Icon from 'src/components/Icon'
import { useAuth } from 'src/hooks/useAuth';

// @ Translation
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { ROUTE_CONFIG } from 'src/configs/route';

type TProps = {}

const UserDropdown = (props: TProps) => {

    // Translation
    const { t } = useTranslation()

    const { user, logout } = useAuth()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const router = useRouter()

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNavigateMyProfile = () => {
        router.push(ROUTE_CONFIG.My_profile);
        handleClose();
    }

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>


                <Tooltip title={t('Account')}>
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar sx={{ width: 32, height: 32 }}>

                            {user?.avatar ? (
                                <Image
                                    src={user?.avatar || ''}
                                    alt='avatar'
                                    width={0}
                                    height={0}
                                    style={{
                                        height: '32px',
                                        width: '32px',
                                        objectFit: 'cover'
                                    }}
                                />
                            ) : (
                                <Icon icon='ph:user-thin' />
                            )}

                        </Avatar>
                    </IconButton>
                </Tooltip>
            </Box >
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleClose}>
                    {user?.email}
                </MenuItem>
                <MenuItem onClick={handleNavigateMyProfile}>
                    <Avatar>
                        <Icon icon='arcticons:phone-manager' />
                    </Avatar>{' '}  {t('My_profile')}
                </MenuItem>
                <Divider />
                <MenuItem onClick={logout}>
                    <Avatar sx={{ backgroundColor: 'transparent' }}>
                        <Icon icon='material-symbols-light:logout' />
                    </Avatar>
                    {t('Logout')}
                </MenuItem>
            </Menu>
        </>
    );
}

export default UserDropdown
