// ** React
import React, { useEffect, useMemo } from 'react'

// ** Next
import Image from 'next/image'
import { useRouter } from 'next/router'

// ** Mui Imports
import Box from '@mui/material/Box'


import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { Badge } from '@mui/material'

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
import { get } from 'http'
import { getLocalProductToCart } from 'src/helpers/storage'
import { addProductToCart } from 'src/stores/order-product'

type TProps = {}

const CardProduct = (props: TProps) => {
  // ** Translation
  const { t, i18n } = useTranslation()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const { user } = useAuth()
  // ** Redux
  const dispatch: AppDispatch = useDispatch()
  const { orderItems } = useSelector((state: RootState) => state.orderProduct)

  const open = Boolean(anchorEl)

  const router = useRouter()



  const handleClick = () => {

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
        addProductToCart({
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
      </Box>


    </>
  )
}

export default CardProduct
