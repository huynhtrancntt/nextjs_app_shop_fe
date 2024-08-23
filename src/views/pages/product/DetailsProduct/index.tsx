// ** Next
import { NextPage } from 'next'

// ** React
import { useEffect, useState } from 'react'

// ** Mui
import {
  Avatar,
  Box,
  Button,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  Rating,
  Typography,
  useTheme
} from '@mui/material'

// ** Components
import CustomTextField from 'src/components/text-field'
import Icon from 'src/components/Icon'
import WrapperFileUpload from 'src/components/wrapper-file-upload'

// ** form
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Config
import { EMAIL_REG } from 'src/configs/regex'

// ** Translate
import { t } from 'i18next'
import { useTranslation } from 'react-i18next'

// ** services


// ** Utils
import { convertBase64, convertUpdateProductToCart, formatNumberToLocal, separationFullName, toFullName } from 'src/utils'

// ** Redux


// ** component
import FallbackSpinner from 'src/components/fall-back'

// ** Other
import toast from 'react-hot-toast'
import Spinner from 'src/components/spinner'
import { getDetailsProductPublicBySlug, getListProductRelatedBySlug } from 'src/services/product'
import { useRouter } from 'next/router'
import { TProduct } from 'src/types/product'
import Image from 'next/image'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

import { addProductToCart } from 'src/utils/addToCart'
import { useAuth } from 'src/hooks/useAuth'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { TItemOrderProduct } from 'src/types/order-product'
import CartProduct from '../components/CartProduct'
import CardRelatedProduct from '../components/CardRelatedProduct'
import NoData from 'src/components/no-data'

type TProps = {}

const DetailsProductPage: NextPage<TProps> = () => {
  // State
  const [loading, setLoading] = useState(false)
  const [amountProduct, setAmountProduct] = useState(1)
  const [dataProduct, setDataProduct] = useState<TProduct | any>({})
  const [dataProductRelated, setDataProductRelated] = useState<TProduct[]>([])

  const router = useRouter()
  const productId = router.query?.productId as string

  const { user } = useAuth()

  // ** Hooks
  const { i18n } = useTranslation()



  // ** theme
  const theme = useTheme()

  // ** redux
  const dispatch: AppDispatch = useDispatch()
  const { orderItems } = useSelector((state: RootState) => state.orderProduct)

  // fetch api
  // DetailsProduct
  const fetchGetDetailsProduct = async (slug: string) => {
    setLoading(true)
    await getDetailsProductPublicBySlug(slug)
      .then(async response => {
        setLoading(false)
        const data = response?.data
        if (data) {
          setDataProduct(data)
        }
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (productId) {
      fetchGetDetailsProduct(productId)

      //slug
      fetchListProductRelated(productId)
    }
  }, [productId])

  const fetchListProductRelated = async (slug: string) => {
    setLoading(true)
    await getListProductRelatedBySlug({ params: { slug: slug } })
      .then(async response => {
        setLoading(false)
        const data = response?.data
        if (data) {
          setDataProductRelated(data?.products)
        }
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (productId) {
      fetchGetDetailsProduct(productId)
    }
  }, [productId])


  const handleAddToCart = (item: TItemOrderProduct) => {

    if (user?._id) {
      // add to cart
      if (amountProduct <= dataProduct.countInStock) {
        addProductToCart(
          user?._id,
          item,
          orderItems,
          amountProduct,
          dispatch
        );
        toast.success(t('Add_to_cart_success'))
      }
    } else {
      toast.error(t('Please_login_first'))
    }



  }


  return (
    <>
      {loading && <Spinner />}
      <Grid container>
        <Grid
          container
          item
          md={12}
          xs={12}
          sx={{ backgroundColor: theme.palette.background.paper, borderRadius: '15px', py: 5, px: 4 }}
        >

          <Box sx={{ height: '100%', width: '100%' }}>
            <Grid container spacing={12} >
              <Grid item md={5} xs={12}>
                <Image
                  src={dataProduct?.image}
                  alt={dataProduct?.image}
                  width={0}
                  height={0}
                  style={{
                    height: '100%',
                    maxHeight: '420px',
                    width: '100%',
                    borderRadius: '15px'
                  }}
                />
              </Grid>
              <Grid item md={7} xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography
                    variant='h5'
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 'bold',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      '-webkitLineClamp': '2',
                      '-webkitBoxOrient': 'vertical'
                    }}
                  >
                    {dataProduct.name}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>


                  {/* averageRating*/}
                  {!!dataProduct?.averageRating && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant='h5'
                        sx={{
                          color: theme.palette.primary.main,
                          fontWeight: 'bold',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          '-webkitLineClamp': '2',
                          '-webkitBoxOrient': 'vertical',
                          textDecoration: 'underline',
                          fontSize: '16px'
                        }}
                      >
                        {dataProduct.averageRating}
                      </Typography>
                      <Rating
                        name='read-only'
                        sx={{ fontSize: '16px' }}
                        defaultValue={dataProduct?.averageRating}
                        precision={0.5}
                        readOnly
                      />
                    </Box>
                  )}
                  <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                    {!!dataProduct.totalReviews ? (
                      <span>
                        <b>{dataProduct.totalReviews}</b>
                        {t('Review')}
                      </span>
                    ) : (
                      <span>{t('not_review')}</span>
                    )}
                  </Typography>
                  {dataProduct.sold && (
                    <Typography variant='body2' color='text.secondary'>
                      <>{t('Sold_product', { count: dataProduct.countInStock })}</>
                    </Typography>
                  )}
                </Box>
                {/* Location */}
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Icon icon='mdi:map-marker-outline' />
                  <Typography variant='h6'
                    sx={{

                      fontWeight: 'bold',
                      fontSize: '12px',
                    }}>
                    {dataProduct?.location?.name}
                  </Typography>
                </Box>
                {/* price / Giá */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mt: 2,
                    backgroundColor: theme.palette.customColors.bodyBg,
                    padding: '8px',
                    borderRadius: '8px'
                  }}
                >
                  {dataProduct.discount > 0 && (
                    <Typography
                      variant='h6'
                      sx={{
                        color: theme.palette.error.main,
                        fontWeight: 'bold',
                        textDecoration: 'line-through',
                        fontSize: '18px'
                      }}
                    >
                      {formatNumberToLocal(dataProduct.price)} VND
                    </Typography>
                  )}
                  <Typography
                    variant='h4'
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 'bold',
                      fontSize: '24px'
                    }}
                  >
                    {dataProduct.discount > 0 ? (
                      <>{formatNumberToLocal((dataProduct.price * (100 - dataProduct.discount)) / 100)}</>
                    ) : (
                      <>{formatNumberToLocal(dataProduct.price)}</>
                    )}{' '}
                    VND
                  </Typography>
                  {dataProduct.discount > 0 && (
                    <Box
                      sx={{
                        backgroundColor: hexToRGBA(theme.palette.error.main, 0.42),
                        width: '36px',
                        height: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '2px'
                      }}
                    >
                      <Typography
                        variant='h6'
                        sx={{
                          color: theme.palette.error.main,
                          fontSize: '10px',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        - {dataProduct.discount} %
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                  <IconButton
                    onClick={() => {
                      if (amountProduct > 1) {
                        setAmountProduct((prev) => prev - 1)

                      }

                    }}
                    sx={{ backgroundColor: `${theme.palette.primary.main} !important`, color: `${theme.palette.common.white}` }}>
                    <Icon icon='ic:round-minus'></Icon>
                  </IconButton>
                  <CustomTextField
                    onChange={(e) => {
                      const numValue = +e.target.value.replace(/\D/g, '')
                      if (numValue >= 1) {
                        setAmountProduct(numValue)
                      }
                      if (numValue > dataProduct.countInStock) {
                        setAmountProduct(dataProduct.countInStock)
                      }

                    }}

                    value={amountProduct}
                    inputProps={{
                      inputMode: 'numeric',
                      pattern: '[0-9]*',

                    }}
                    sx={{
                      '.MuiInputBase-input.MuiFilledInput-input': { width: '30px' },
                      '.MuiInputBase-root.MuiFilledInput-root': {
                        borderTop: 'none',
                        borderLeft: 'none',
                        borderRight: 'none',
                        borderRadius: '0px !important',
                        '&.Mui-focused': { backgroundColor: `${theme.palette.background.paper} !important`, boxShadow: 'none !important' }
                      },

                      ml: 1,
                      mr: 1
                    }}></CustomTextField>

                  <IconButton
                    onClick={() => {

                      setAmountProduct((prev) => prev + 1)
                      if (amountProduct >= dataProduct.countInStock) {
                        setAmountProduct(dataProduct.countInStock)
                      }
                    }}
                    sx={{ backgroundColor: `${theme.palette.primary.main} !important`, color: `${theme.palette.common.white}` }}
                  >
                    <Icon icon='ic:round-plus'></Icon>
                  </IconButton></Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingBottom: 2,
                    gap: 4,
                    mt: 4
                  }}
                >
                  <Button
                    onClick={() => {
                      handleAddToCart(dataProduct)
                    }}
                    variant='outlined'
                    sx={{
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                      fontWeight: 'bold'
                    }}
                  >
                    <Icon icon='bx:cart' fontSize={24} style={{ position: 'relative', top: '-2px' }} />
                    {t('Add_to_cart')}
                  </Button>
                  <Button
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
              </Grid>
            </Grid>
          </Box>
        </Grid >
      </Grid >
      <Grid container md={12} xs={12} mt={6}>
        <Grid container>
          <Grid
            container
            item
            md={9}
            xs={12}
            sx={{ backgroundColor: theme.palette.background.paper, borderRadius: '15px', py: 5, px: 4 }}
          >
            <Box sx={{ height: '100%', width: '100%' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mt: 2,
                  backgroundColor: theme.palette.customColors.bodyBg,
                  padding: '8px',
                  borderRadius: '8px'
                }}
              >
                <Typography
                  variant='h6'
                  sx={{
                    color: `rgba(${theme.palette.customColors.main}, 0.68)`,
                    fontWeight: 'bold',
                    fontSize: '18px'
                  }}
                >
                  {t('Description_product')}
                </Typography>
              </Box>
              <Box
                sx={{
                  mt: 4,
                  color: `rgba(${theme.palette.customColors.main}, 0.42)`,
                  fontSize: '14px',
                  backgroundColor: theme.palette.customColors.bodyBg,
                  padding: 4,
                  borderRadius: '10px'
                }}
                dangerouslySetInnerHTML={{ __html: dataProduct.description }}
              />
            </Box>
          </Grid>
          <Grid container item md={3} xs={12} mt={{ md: 0, xs: 5 }}>
            <Box
              sx={{
                height: '100%',
                width: '100%',
                backgroundColor: theme.palette.background.paper,
                borderRadius: '15px',
                py: 5,
                px: 4
              }}
              marginLeft={{ md: 5, xs: 0 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mt: 2,
                  backgroundColor: theme.palette.customColors.bodyBg,
                  padding: '8px',
                  borderRadius: '8px'
                }}
              >
                <Typography
                  variant='h6'
                  sx={{
                    color: `rgba(${theme.palette.customColors.main}, 0.68)`,
                    fontWeight: 'bold',
                    fontSize: '18px'
                  }}
                >
                  {t('Product_same')}
                </Typography>
              </Box>
              <Box
                sx={{
                  mt: 4
                }}
              >
                {dataProductRelated.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {dataProductRelated.map(item => {
                      return <CardRelatedProduct key={item._id} item={item} />
                    })}
                  </Box>
                ) : (
                  <Box sx={{ width: '100%', mt: 10 }}>
                    <NoData widthImage='60px' heightImage='60px' textNoData={t('No_product')} />
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
          <Grid container item md={8} xs={12}>
            <Box
              sx={{
                height: '100%',
                width: '100%',
                backgroundColor: theme.palette.background.paper,
                borderRadius: '15px',
                py: 5,
                px: 4
              }}
              marginTop={{ md: 5, xs: 0 }}
            >
              Review
            </Box>
          </Grid>
        </Grid>
      </Grid>


    </>
  )
}

export default DetailsProductPage
