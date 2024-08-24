// ** React
import React, { use, useEffect, useMemo } from 'react'

// ** Next

import { useRouter } from 'next/router'

// ** Mui Imports
import Box from '@mui/material/Box'


import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { Avatar, Badge, Button, Menu, MenuItem, styled, Typography, useTheme } from '@mui/material'
import { MenuItemProps } from '@mui/material'
// ** Components
import Icon from 'src/components/Icon'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Translate
import { useTranslation } from 'react-i18next'



// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { TItemOrderProduct } from 'src/types/order-product'


import { getLocalProductToCart } from 'src/helpers/storage'
import { updateProductToCart } from 'src/stores/order-product'
import { formatNumberToLocal, isExpiredProduct } from 'src/utils'

import { ROUTE_CONFIG } from 'src/configs/route'
import NoData from 'src/components/no-data'


type TProps = {}

const StyleMenuItem = styled(MenuItem)<MenuItemProps>(({ theme }) => ({

}))
const CartProduct = (props: TProps) => {
  // ** Translation
  const { t, i18n } = useTranslation()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  // Hooks
  const { user } = useAuth()



  const theme = useTheme()
  // ** Redux
  const dispatch: AppDispatch = useDispatch()
  const { orderItems } = useSelector((state: RootState) => state.orderProduct)

  const open = Boolean(anchorEl)

  const router = useRouter()

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleNavigateProduct = (item: TItemOrderProduct) => {
    router.push(`${ROUTE_CONFIG.PRODUCT}/${item.slug}`)

  }


  const totalItems = useMemo(() => {
    const total = orderItems.reduce((acc, item: TItemOrderProduct) => {

      return acc + item.amount

    }, 0)

    return total

  }, [orderItems])

  useEffect(() => {
    const productCart = getLocalProductToCart()

    const parseProductCart = productCart ? JSON.parse(productCart) : {}

    if (user?._id) {
      dispatch(
        updateProductToCart({
          orderItems: parseProductCart[user?._id] || []
        })
      )
    }


  }, [])




  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title={t('Cart')}>
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
          {orderItems.length > 0 ? (
            <Box sx={{ maxHeight: '300px', overflow: 'auto' }}>
              {orderItems?.map((item: TItemOrderProduct) => (
                <StyleMenuItem
                  key={item.product}
                  onClick={() => handleNavigateProduct(item)}
                >
                  <Avatar alt={item.name} src={item.image} />
                  <Box sx={{ ml: 2, flex: 1 }}>
                    <Typography >   {item.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {item.discount > 0 && (
                        <Typography
                          variant='h6'
                          sx={{
                            color: theme.palette.error.main,
                            fontWeight: 'bold',
                            textDecoration: 'line-through',
                            fontSize: '10px'
                          }}
                        >
                          {formatNumberToLocal(item.price)} VND
                        </Typography>
                      )}
                      <Typography
                        variant='h4'
                        sx={{
                          color: theme.palette.primary.main,
                          fontWeight: 'bold',
                          fontSize: '12px'
                        }}
                      >
                        {item.discount > 0 ? (
                          <>{formatNumberToLocal((item.price * (100 - item.discount)) / 100)}</>
                        ) : (
                          <>{formatNumberToLocal(item.price)}</>
                        )}{' '}
                        VND
                      </Typography>

                    </Box>

                  </Box>


                </StyleMenuItem>
              ))}
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                <Button type='submit' variant='contained' sx={{ mr: 2, borderRadius: '0px' }} onClick={() => router.push(ROUTE_CONFIG.MY_CART)}>
                  {t('View_cart')}
                </Button>
              </Box>
            </Box>

          ) : <>
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '300px', mt: 2 }}>
              <NoData widthImage='40px' heightImage='40px' textNoData={t('Cart_is_empty')} />
            </Box>
          </>
          }







        </Menu >
      </Box >


    </>
  )
}

export default CartProduct
