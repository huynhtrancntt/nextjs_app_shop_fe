// ** React
import React, { useEffect, useMemo } from 'react'

// ** Next
import Image from 'next/image'
import { useRouter } from 'next/router'

// ** Mui Imports
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { Badge, Typography, styled } from '@mui/material'

// ** Components
import Icon from 'src/components/Icon'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Translate
import { useTranslation } from 'react-i18next'

// ** config
import { ROUTE_CONFIG } from 'src/configs/route'

// ** Utils
import { toFullName } from 'src/utils'

// ** Redux
import { useSelector } from 'react-redux'
import { RootState } from 'src/stores'
import { TItemOrderProduct } from 'src/types/order-product'

type TProps = {}

const CardProduct = (props: TProps) => {
  // ** Translation
  const { t, i18n } = useTranslation()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  // ** Redux

  const { orderItems } = useSelector((state: RootState) => state.orderProduct)

  const open = Boolean(anchorEl)

  const router = useRouter()

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleNavigateMyProfile = () => {
    router.push(ROUTE_CONFIG.MY_PROFILE)
    handleClose()
  }

  const handleNavigateChangePassword = () => {
    router.push(ROUTE_CONFIG.CHANGE_PASSWORD)
    handleClose()
  }

  const handleNavigateManageSystem = () => {
    router.push(ROUTE_CONFIG.DASHBOARD)
    handleClose()
  }
  const totalItems = useMemo(() => {
    const total = orderItems.reduce((acc, item: TItemOrderProduct) => {

      return acc + item.amount

    }, 0)

    return total

  }, [orderItems])

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title={t('Account')}>
          <IconButton
            onClick={handleClick}
          // color=''
          >
            {!!orderItems.length ? (
              <>
                <Badge color='primary' badgeContent={totalItems}>
                  <Icon icon='flowbite:cart-outline' />
                </Badge></>
            ) :
              <Icon icon='flowbite:cart-outline' />
            }

          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id='account-menu'
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
              mr: 1
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
              zIndex: 0
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleNavigateMyProfile}>
          <Avatar>
            <Icon icon='ph:user-thin' />
          </Avatar>{' '}
          {t('My_profile')}
        </MenuItem>
        <MenuItem onClick={handleNavigateChangePassword}>
          <Avatar sx={{ backgroundColor: 'transparent' }}>
            <Icon icon='arcticons:password' />
          </Avatar>
          {t('Change_password')}
        </MenuItem>
        <MenuItem>
          <Avatar sx={{ backgroundColor: 'transparent' }}>
            <Icon icon='material-symbols-light:logout' />
          </Avatar>
          {t('Logout')}
        </MenuItem>
      </Menu>
    </>
  )
}

export default CardProduct
