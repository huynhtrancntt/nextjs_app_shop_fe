

import Image from 'next/image';

// @mui
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material';
import { Badge } from '@mui/material';

import { useState } from 'react';
import { Avatar, Box } from '@mui/material';

// @Components
import Icon from 'src/components/Icon'
import { useAuth } from 'src/hooks/useAuth';

// @ Translation
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
// @ route
import { ROUTE_CONFIG } from 'src/configs/route';
// @ts-ignoreutils
import { toFullName } from 'src/utils';


type TProps = {}


const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""'
        }
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0
        }
    }
}))

const UserDropdown = (props: TProps) => {

    // Translation
    const { t, i18n } = useTranslation()

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

    const handleNavigateChangePassword = () => {
        router.push(ROUTE_CONFIG.CHANGE_PASSWORD);
        handleClose();
    }

    const handleNavigateManageSystem = () => {
        router.push(ROUTE_CONFIG.DASHBOARD)
        handleClose()
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mx: 2, pb: 2, px: 2 }}>
                    <StyledBadge overlap='circular' anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant='dot'>
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
                    </StyledBadge>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography component='span'>
                            {toFullName(user?.lastName || '', user?.middleName || '', user?.firstName || '', i18n.language)}
                        </Typography>
                        <Typography component='span'>{user?.role?.name}</Typography>
                    </Box>
                </Box>
                <Divider />
                <MenuItem onClick={handleNavigateManageSystem}>
                    <Avatar>
                        <Icon icon='arcticons:phone-manager' />
                    </Avatar>{' '}
                    {t('Manage_system')}
                </MenuItem>
                <MenuItem onClick={handleNavigateMyProfile}>
                    <Avatar>
                        <Icon icon='arcticons:phone-manager' />
                    </Avatar>

                    {' '}  {t('My_profile')}
                </MenuItem>
                <MenuItem onClick={handleNavigateChangePassword}>
                    <Avatar >
                        <Icon icon='arcticons:password' />
                    </Avatar>

                    {' '}  {t('Change_password')}
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
