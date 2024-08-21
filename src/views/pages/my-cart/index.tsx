// ** Next
import { NextPage } from 'next'

// ** React
import { useEffect, useMemo, useState } from 'react'

// ** Mui
import { Avatar, Box, Button, Checkbox, FormHelperText, Grid, IconButton, InputLabel, Tooltip, Typography, useTheme } from '@mui/material'

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
import { getAuthMe } from 'src/services/auth'
import { getAllRoles } from 'src/services/role'
import { getAllCities } from 'src/services/city'

// ** Utils
import { cloneDeep, convertBase64, convertUpdateProductToCart, formatNumberToLocal, separationFullName, toFullName } from 'src/utils'

// ** Redux

import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'


import { TItemOrderProduct } from 'src/types/order-product'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { Divider } from '@mui/material'
import { decreaseProductToCart, increaseProductToCart, updateProductToCart } from 'src/stores/order-product'
import { TProduct } from 'src/types/product'
import { getLocalProductToCart, setLocalProductToCart } from 'src/helpers/storage'
import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'
import { addProductToCart, removeProductFromCart } from 'src/utils/addToCart'



type TProps = {}

type TDefaultValue = {
  email: string
  address: string
  city: string
  phoneNumber: string
  role: string
  fullName: string
}

const MyCartPage: NextPage<TProps> = () => {
  // State
  const [loading, setLoading] = useState(false)


  const [selectRows, setSelectRows] = useState<string[]>([])
  // ** Hooks
  const { i18n } = useTranslation()
  const { user } = useAuth()

  // ** theme
  const theme = useTheme()

  // ** redux
  const dispatch: AppDispatch = useDispatch()

  const { orderItems } = useSelector(
    (state: RootState) => state.orderProduct
  )

  const memoListAllProductIds = useMemo(() => {
    const listId = orderItems.map((item: TItemOrderProduct) => item.product)

    return listId
  }, [orderItems])



  const handleChangeAmountCart = (item: TItemOrderProduct, quantity: number) => {

    if (user?._id) {
      // add to cart

      addProductToCart(
        user?._id,
        item,
        orderItems,
        quantity,
        dispatch
      );
      toast.success(t('Update_to_cart_success'))

    } else {
      toast.error(t('Please_login_first'))
    }


  }

  const handleRemoveCart = (item: TItemOrderProduct) => {

    if (user?._id) {
      removeProductFromCart(
        user?._id,
        [item.product], // Pass the product ID in an array
        orderItems,
        dispatch
      );
      toast.success(t('Remove_to_cart_success'))
    } else {

      toast.error(t('Please_login_first'))
    }
    // removeProductFromCart(item, dispatch, user?._id, orderItems, setSelectRows, selectRows)
    // const productCart = getLocalProductToCart()

    // const parseProductCart = productCart ? JSON.parse(productCart) : {}

    // const cloneOrderItems = cloneDeep(orderItems)

    // const filteredItems = cloneOrderItems.filter((i: TItemOrderProduct) => i.product !== item.product)

    // if (user?._id) {
    //   dispatch(
    //     updateProductToCart({
    //       orderItems: filteredItems
    //     })
    //   )
    //   setLocalProductToCart({ ...parseProductCart, [user?._id]: filteredItems })
    // }

  }

  const handleRemoveCartAll = () => {

    if (user?._id) {
      removeProductFromCart(
        user?._id,
        selectRows, // Pass the product ID in an array
        orderItems,
        dispatch
      );
      toast.success(t('Remove_to_cart_success'))
    } else {

      toast.error(t('Please_login_first'))
    }
    // const productCart = getLocalProductToCart()

    // const parseProductCart = productCart ? JSON.parse(productCart) : {}

    // const cloneOrderItems = cloneDeep(orderItems)

    // const filteredItems = cloneOrderItems.filter((i: TItemOrderProduct) => !selectRows.includes(i.product))

    // if (user?._id) {
    //   dispatch(
    //     updateProductToCart({
    //       orderItems: filteredItems
    //     })
    //   )
    //   setLocalProductToCart({ ...parseProductCart, [user?._id]: filteredItems })
    // }
  }

  const handleOnChangeCheckBox = (value: string) => {

    const isChecked = selectRows.includes(value)
    if (isChecked) {
      const filtered = selectRows.filter(item => item !== value)
      setSelectRows(filtered)
    } else {
      setSelectRows([...selectRows, value])
    }
  }

  const handChangeCheckAll = () => {

    const isChecked = memoListAllProductIds.every(item => selectRows.includes(item))
    if (isChecked) {
      setSelectRows([])
    } else {
      setSelectRows(memoListAllProductIds)
    }
  }

  return (
    <>
      {/* {loading || (isLoading && <Spinner />)} */}

      <Box sx={{ height: '100%', width: '100%' }}>
        <Grid container spacing={4}>
          <Grid item md={12} xs={12}>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                padding: '40px',
                backgroundColor: theme.palette.background.paper, borderRadius: '15px'
              }}
            >
              {orderItems?.length > 0 &&
                <>
                  <Box sx={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    gap: '8px',
                    mb: '10px'
                  }}>

                    <Box sx={{ flexBasis: '5%' }}>
                      <Checkbox
                        checked={memoListAllProductIds.every(item => selectRows.includes(item))}
                        onChange={() => handChangeCheckAll()}
                      />
                    </Box>
                    <Box sx={{ flexBasis: '10%' }}>  {t('Cart_product_image')}</Box>
                    <Typography sx={{ flexBasis: '40%' }}>
                      {t('Cart_product_name')}
                    </Typography>
                    <Box sx={{ flexBasis: '25%' }}>  {t('Cart_product_price')}</Box>
                    <Box sx={{ flexBasis: '15%' }}>  {t('Cart_product_quantity')}</Box>
                    <Box sx={{ flexBasis: '15%' }}>  {t('Cart_product_total')}</Box>
                    <Box sx={{ flexBasis: '5%' }}>
                      <Tooltip title={t('Cart_product_remove')}>
                        <IconButton
                          onClick={() => handleRemoveCartAll()}
                          sx={{ color: `${theme.palette.error.main}` }}
                          disabled={!selectRows.length}
                        >
                          <Icon icon='mdi:delete-outline'></Icon>
                        </IconButton>
                      </Tooltip>
                    </Box>


                  </Box>
                  <Divider />
                </>
              }
              <Box sx={{ width: '100%', gap: '8px', display: 'flex', flexDirection: 'column', mt: '10px' }}>
                {orderItems?.map((item: TItemOrderProduct, index: number) => {

                  return (
                    <>
                      <Box
                        key={item.product}
                        sx={{
                          display: 'flex',
                          paddingTop: '20px',
                          width: '100%',
                          alignItems: 'flex-start',
                        }}
                      >
                        <Box sx={{ flexBasis: '5%' }}>
                          <Checkbox
                            checked={selectRows.includes(item.product)}
                            value={item.product}
                            onChange={(e) => handleOnChangeCheckBox(e.target.value)} />
                        </Box>
                        <Box sx={{ flexBasis: '10%' }}>

                          <Avatar alt={item.name} src={item.image} />
                        </Box>
                        <Typography sx={{
                          fontWeight: 'bold',
                          fontSize: '24px',
                          flexBasis: '40%',
                          maxWidth: '100%',
                          // hiện thị dấu  ....
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          display: 'block',
                          color: theme.palette.primary.main
                        }}>
                          {item.name}

                        </Typography>
                        <Box sx={{ flexBasis: '25%' }}>
                          <Typography
                            variant='h4'
                            sx={{
                              color: theme.palette.primary.main,
                              fontWeight: 'bold',
                              fontSize: '22px'
                            }}
                          >
                            {item.discount > 0 ? (
                              <>{formatNumberToLocal((item.price * (100 - item.discount)) / 100)}</>
                            ) : (
                              <>{formatNumberToLocal(item.price)}</>
                            )}{' '}
                            VND
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {item.discount > 0 && (
                              <Typography
                                variant='h6'
                                sx={{
                                  color: theme.palette.error.main,
                                  fontWeight: 'bold',
                                  textDecoration: 'line-through',
                                  fontSize: '18px'
                                }}
                              >
                                {formatNumberToLocal(item.price)} VND
                              </Typography>
                            )}
                            {item.discount > 0 && (
                              <Box
                                sx={{
                                  backgroundColor: hexToRGBA(theme.palette.error.main, 0.42),
                                  width: '36px',
                                  height: '14px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderRadius: '3px',
                                  padding: '2px'

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
                                  - {item.discount} %
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>
                        <Box sx={{ flexBasis: '15%', display: 'flex', alignItems: 'center' }}>

                          <IconButton
                            onClick={() => { handleChangeAmountCart(item, -1) }}
                            sx={{ backgroundColor: `${theme.palette.primary.main} !important`, color: `${theme.palette.common.white}` }}>
                            <Icon icon='ic:round-minus'></Icon>
                          </IconButton>
                          <CustomTextField

                            // onChange={(e) => {
                            //   const numValue = +e.target.value
                            //   console.log(numValue);
                            //   handleChangeAmountCart(item, numValue)
                            // }}

                            value={item.amount}
                            inputProps={{
                              inputMode: 'numeric',
                              pattern: '[0-9]*',
                              min: 1,
                              max: 100

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
                            onClick={() => { handleChangeAmountCart(item, 1) }}
                            sx={{ backgroundColor: `${theme.palette.primary.main} !important`, color: `${theme.palette.common.white}` }}
                          >
                            <Icon icon='ic:round-plus'></Icon>
                          </IconButton>
                        </Box>
                        <Box sx={{ flexBasis: '15%' }}>
                          <Typography
                            variant='h6'
                            sx={{
                              color: theme.palette.primary.main,
                              fontWeight: 'bold',
                              fontSize: '18px'
                            }}
                          >

                            {item.discount > 0 ? (
                              <>{formatNumberToLocal(item.amount * (item.price * (100 - item.discount)) / 100)}</>
                            ) : (
                              <>{formatNumberToLocal(item.amount * item.price)}</>
                            )}{' '}
                            VND
                          </Typography>
                        </Box>
                        <Box sx={{ flexBasis: '5%' }}>
                          <IconButton
                            onClick={() => { handleRemoveCart(item) }}
                            sx={{ color: `${theme.palette.error.main}` }}
                          >
                            <Icon icon='mdi:delete-outline'></Icon>
                          </IconButton>
                        </Box>



                      </Box>

                      {index !== orderItems.length - 1 && <Divider />}

                    </>

                  )
                })}
              </Box>

              {orderItems?.length > 0 &&
                <>
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mt: '20px' }}>
                    <Button
                      disabled={!selectRows.length}
                      variant='contained'
                      sx={{
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        fontWeight: 'bold'
                      }}
                    >
                      <Icon icon='icon-park-outline:buy' fontSize={20} />
                      {t('Buy_now')}
                    </Button>
                  </Box>
                </>

              }


            </Box>
          </Grid>

        </Grid>
      </Box >

    </>
  )
}

export default MyCartPage
