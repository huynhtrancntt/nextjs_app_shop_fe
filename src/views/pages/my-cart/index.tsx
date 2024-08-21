// ** Next
import { NextPage } from 'next'

// ** React
import { useEffect, useState } from 'react'

// ** Mui
import { Avatar, Box, Button, Checkbox, FormHelperText, Grid, IconButton, InputLabel, Typography, useTheme } from '@mui/material'

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
import { convertBase64, formatNumberToLocal, separationFullName, toFullName } from 'src/utils'

// ** Redux

import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'


import { TItemOrderProduct } from 'src/types/order-product'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { Divider } from '@mui/material'

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
  const [avatar, setAvatar] = useState('')
  const [optionRoles, setOptionRoles] = useState<{ label: string; value: string }[]>([])
  const [isDisabledRole, setIsDisabledRole] = useState(false)
  const [optionCities, setOptionCities] = useState<{ label: string; value: string }[]>([])

  // ** Hooks
  const { i18n } = useTranslation()

  // ** theme
  const theme = useTheme()

  // ** redux
  const dispatch: AppDispatch = useDispatch()
  const { orderItems } = useSelector(
    (state: RootState) => state.orderProduct
  )

  console.log("orderItems", orderItems)

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

              <Box sx={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                gap: '8px',
                mb: '10px'
              }}>
                <Box sx={{ flexBasis: '5%' }}></Box>
                <Box sx={{ flexBasis: '10%' }}>  {t('Cart_product_image')}</Box>
                <Typography sx={{ flexBasis: '40%' }}>
                  {t('Cart_product_name')}
                </Typography>
                <Box sx={{ flexBasis: '25%' }}>  {t('Cart_product_price')}</Box>
                <Box sx={{ flexBasis: '15%' }}>  {t('Cart_product_quantity')}</Box>
                <Box sx={{ flexBasis: '15%' }}>  {t('Cart_product_total')}</Box>
                <Box sx={{ flexBasis: '5%' }}>
                </Box>
              </Box>
              <Divider />
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
                          <Checkbox />
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
                        <Box sx={{ flexBasis: '15%', display: 'flex', alignItems: 'center', gap: '2' }}>

                          <IconButton sx={{ backgroundColor: `${theme.palette.primary.main} !important`, color: `${theme.palette.common.white}` }}>
                            <Icon icon='ic:round-minus'></Icon>
                          </IconButton>
                          <CustomTextField value={item.amount} sx={{
                            '.MuiInputBase-input.MuiFilledInput-input': { width: '20px' },
                            '.MuiInputBase-root.MuiFilledInput-root': { border: 'none' }
                          }}></CustomTextField>

                          <IconButton
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
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mt: '20px' }}>
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
                  <Icon icon='icon-park-outline:buy' fontSize={20} />
                  {t('Buy_now')}
                </Button>
              </Box>
            </Box>
          </Grid>

        </Grid>
      </Box >

    </>
  )
}

export default MyCartPage
