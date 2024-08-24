import * as React from 'react'
import { useTranslation } from 'react-i18next'

// ** Mui
import { styled, useTheme } from '@mui/material/styles'
import Card from '@mui/material/Card'
import { Box, Button, Rating } from '@mui/material'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Components
import Icon from 'src/components/Icon'

// ** Config
import { ROUTE_CONFIG } from 'src/configs/route'
import { convertUpdateProductToCart, formatNumberToLocal, isExpiredProduct } from 'src/utils'

import { TProduct } from 'src/types/product'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { useRouter } from 'next/router'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { updateProductToCart } from 'src/stores/order-product'


// Storage
import { getLocalProductToCart, setLocalProductToCart } from 'src/helpers/storage'
import { useAuth } from 'src/hooks/useAuth'
import { addProductToCart } from 'src/utils/addToCart'
import { TItemOrderProduct } from 'src/types/order-product'
import toast from 'react-hot-toast'
import { likeProductAsync, unLikeProductAsync } from 'src/stores/product/actions'

interface TCartProduct {
  item: TProduct
}

const StyleCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  boxShadow: theme.shadows[4],
  '.MuiCardMedia-root.MuiCardMedia-media': {
    objectFit: 'contain'
  }
}))

const CartProduct = (props: TCartProduct) => {
  // ** Props
  const { item } = props

  // ** Hooks
  const { t } = useTranslation()
  const theme = useTheme()
  const router = useRouter()
  const { user } = useAuth()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()

  const { orderItems } = useSelector((state: RootState) => state.orderProduct)

  // ** handle
  const handleNavigateDetails = (slug: string) => {
    router.push(`${ROUTE_CONFIG.PRODUCT}/${slug}`)
  }

  const handleUpdateProductToCart = (item: TProduct) => {


    // TProduct
    const addToCard: TItemOrderProduct = {
      name: item.name,
      amount: 1,
      image: item.image,
      price: item.price,
      discount: item.discount,
      product: item._id,
      slug: item.slug,
      averageRating: item.averageRating,
      createdAt: item.createdAt,
      totalLike: item.totalLike,
      countInStock: item.countInStock,
      discountStartDate: item.discountStartDate,
      discountEndDate: item.discountEndDate,
      totalReviews: item.totalReviews,
      sold: item.sold
    }

    if (user?._id) {
      // add to cart
      //if (amountProduct <= dataProduct.countInStock) {
      addProductToCart(
        user?._id,
        addToCard,
        orderItems,
        1,
        dispatch
      );
      toast.success(t('Add_to_cart_success'))

    } else {
      toast.error(t('Please_login_first'))
    }

    // const productCart = getLocalProductToCart()

    // const parseProductCart = productCart ? JSON.parse(productCart) : {}

    // const discount = isExpiredProduct(item.discountStartDate, item.discountEndDate) ? item.discount : 0

    // const addToCard = {
    //   name: item.name,
    //   amount: 1,
    //   image: item.image,
    //   price: item.price,
    //   discount: discount,
    //   product: item._id,
    //   slug: item.slug
    // }
    // const listOrderItems = convertUpdateProductToCart(orderItems, addToCard)
    // // add to cart

    // if (user?._id) {
    //   dispatch(
    //     updateProductToCart({
    //       orderItems: listOrderItems
    //     })
    //   )
    //   setLocalProductToCart({ ...parseProductCart, [user?._id]: listOrderItems })
    // } else {

    //   router.replace({
    //     pathname: '/login',
    //     query: { returnUrl: router.asPath }
    //   })
    // }

  }


  const memoExpiredProduct = React.useMemo(() => {
    return isExpiredProduct(item.discountStartDate, item.discountEndDate)
  }, [item])

  const handleToggleLikeProduct = (id: string, isLiked: boolean) => {
    if (user?._id) {
      if (isLiked) {
        dispatch(unLikeProductAsync({ productId: id }))
      } else {
        dispatch(likeProductAsync({ productId: id }))
      }
    } else {
      toast.error(t('Please_login_first'))
    }
  }

  const handleBuyProductToCart = (item: TProduct) => {

    handleUpdateProductToCart(item)

    router.push(
      {
        pathname: ROUTE_CONFIG.MY_CART,
        query: {
          selected: item._id
        }
      },
      ROUTE_CONFIG.MY_CART
    )
  }

  return (
    <StyleCard sx={{ width: '100%' }}>
      <CardMedia component='img' height='194' sx={{ mt: 4 }} image={item.image ? item.image : ''} alt='image' />
      <CardContent sx={{ padding: '8px 12px' }}>
        {/* Name   */}
        <Typography
          onClick={() => handleNavigateDetails(item.slug)}
          variant='h5'
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 'bold',
            cursor: 'pointer',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            '-webkitLineClamp': '2',
            '-webkitBoxOrient': 'vertical',
            minHeight: '48px',
            mt: 1 // 4px
          }}
        >
          {item.name}
        </Typography>
        {/* Price  / discount*/}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {item.discount > 0 && memoExpiredProduct && (
              <Typography
                variant='h6'
                sx={{
                  color: theme.palette.error.main,
                  fontWeight: 'bold',
                  textDecoration: 'line-through',
                  fontSize: '14px'
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
                fontSize: '18px'
              }}
            >
              {item.discount > 0 && memoExpiredProduct ? (
                <>{formatNumberToLocal((item.price * (100 - item.discount)) / 100)}</>
              ) : (
                <>{formatNumberToLocal(item.price)}</>
              )}{' '}
              VND
            </Typography>
          </Box>
          {item.discount > 0 && memoExpiredProduct && (
            <Box
              sx={{
                backgroundColor: hexToRGBA(theme.palette.error.main, 0.42),
                width: '50px',  // Thay đổi kích thước chiều rộng
                height: '20px',  // Thay đổi kích thước chiều cao
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '10px',  // Tăng độ bo góc
                // boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',  // Thêm đổ bóng
              }}
            >
              <Typography
                variant='h6'
                sx={{
                  color: theme.palette.error.main,
                  fontSize: '12px',  // Tăng kích thước font chữ
                  fontWeight: 'bold',  // Tạo chữ đậm
                  whiteSpace: 'nowrap'
                }}
              >
                - {item.discount} %
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mt: 1 }}>
          {/* CountInStock / sold  */}
          <Typography variant='body2' color='text.secondary'>

            {item.countInStock > 0 ? (
              <>{t('Count_in_stock_product', { count: item.countInStock })}</>
            ) : (
              <span style={{ color: 'red' }}>{t('Out_of_stock_product')}</span>
            )}
          </Typography>
          {item.sold && (
            <Typography variant='body2' color='text.secondary' sx={{ color: "green" }}>
              <>{t('Sold_product', { count: item.countInStock })}</>
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          {/* Location */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Icon icon='mdi:map-marker-outline' />
            <Typography variant='h6'
              sx={{
                // color: theme.palette.error.main,
                fontWeight: 'bold',
                // textDecoration: 'line-through',
                fontSize: '12px',
              }}>
              {item?.location?.name}
            </Typography>
          </Box>
          {/* Like */}
          <IconButton onClick={() => handleToggleLikeProduct(item._id, Boolean(user && item?.likedBy?.includes(user._id)))}>
            {user && item?.likedBy?.includes(user._id) ? (
              <Icon icon='mdi:heart' style={{ color: theme.palette.primary.main }} />
            ) : (
              <Icon icon='tabler:heart' style={{ color: theme.palette.primary.main }} />
            )}
          </IconButton>
        </Box>



        {/* averageRating/ so sanh / Đánh giá /  */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {!!item.averageRating && (
              <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                <b>{item.averageRating}</b>
                <Rating
                  name='read-only'
                  sx={{ fontSize: '16px' }}
                  defaultValue={item?.averageRating}
                  precision={0.5}
                  readOnly
                />
              </Typography>
            )}
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
              {!!item.totalReviews ? <b>{item.totalReviews}</b> : <span>{t('not_review')}</span>}
            </Typography>
          </Box>

        </Box>
      </CardContent>
      {/* Add to cart / Buy now */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 12px 10px', gap: 2 }}>
        <Button
          variant='outlined'
          fullWidth
          sx={{
            height: 40,
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            fontWeight: 'bold'
          }}
          onClick={() => handleUpdateProductToCart(item)}
        >
          <Icon icon='bx:cart' fontSize={24} style={{ position: 'relative', top: '-2px' }} />
          {t('Add_to_cart')}
        </Button>
        <Button
          onClick={() => handleBuyProductToCart(item)}
          fullWidth
          variant='contained'
          sx={{
            height: 40,
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            fontWeight: 'bold'
          }}
        >
          <Icon icon='icon-park-outline:buy' fontSize={20} style={{ position: 'relative', top: '-2px' }} />
          {t('Buy_now')}
        </Button>
      </Box>
    </StyleCard>
  )
}

export default CartProduct
