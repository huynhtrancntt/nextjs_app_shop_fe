// ** Next
import { NextPage } from 'next';

// ** React
import { useEffect, useMemo, useState } from 'react';

// ** Mui
import { Avatar, Box, Button, Checkbox, Divider, Grid, IconButton, Tooltip, Typography, useTheme } from '@mui/material';

// ** Components
import CustomTextField from 'src/components/text-field';
import Icon from 'src/components/Icon';

// ** Translate
import { useTranslation } from 'react-i18next';

// ** Redux
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/stores';

// ** Types
import { TItemOrderProduct } from 'src/types/order-product';

// ** Utils
import { formatNumberToLocal } from 'src/utils';

// ** Hooks
import { useAuth } from 'src/hooks/useAuth';

// ** Services
import toast from 'react-hot-toast';

// ** Cart Utilities
import { addProductToCart, removeProductFromCart } from 'src/utils/addToCart';

import { hexToRGBA } from 'src/utils/hex-to-rgba';
import NoData from 'src/components/no-data';
import Image from 'next/image';

type TProps = {};

const MyCartPage: NextPage<TProps> = () => {
  // ** State
  const [loading, setLoading] = useState(false);
  const [selectRows, setSelectRows] = useState<string[]>([]);

  // ** Translate
  const { t } = useTranslation();
  // ** Hooks
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const theme = useTheme();
  const dispatch: AppDispatch = useDispatch();

  const { orderItems } = useSelector((state: RootState) => state.orderProduct);

  // ** Memoized List of Product IDs
  const memoListAllProductIds = useMemo(() => {
    return orderItems.map((item: TItemOrderProduct) => item.product);
  }, [orderItems]);

  // ** Handle Change in Cart Quantity
  const handleChangeAmountCart = (item: TItemOrderProduct, quantity: number) => {
    if (user?._id) {
      addProductToCart(user?._id, item, orderItems, quantity, dispatch);
      toast.success(t('Update_to_cart_success'));
    } else {
      toast.error(t('Please_login_first'));
    }
  };

  // ** Handle Removing a Single Cart Item
  const handleRemoveCart = (item: TItemOrderProduct) => {
    if (user?._id) {
      removeProductFromCart(user?._id, [item.product], orderItems, dispatch);
      toast.success(t('Remove_to_cart_success'));
    } else {
      toast.error(t('Please_login_first'));
    }
  };

  // ** Handle Removing Selected Cart Items
  const handleRemoveCartAll = () => {
    if (user?._id) {
      removeProductFromCart(user?._id, selectRows, orderItems, dispatch);
      toast.success(t('Remove_to_cart_success'));
    } else {
      toast.error(t('Please_login_first'));
    }
  };



  const handleQuantityChange = (item: TItemOrderProduct, value: number) => {
    // Ensure value is a valid number and greater than 0
    // const quantity = Math.max(1, value);
    // if (user?._id) {
    //   addProductToCart(user._id, item, orderItems, quantity, dispatch);
    //   toast.success(t('Update_to_cart_success'));
    // } else {
    //   toast.error(t('Please_login_first'));
    // }

  };


  // ** Handle Checkbox Changes
  const handleOnChangeCheckBox = (value: string) => {
    const isChecked = selectRows.includes(value);
    setSelectRows(isChecked ? selectRows.filter(item => item !== value) : [...selectRows, value]);
  };

  // ** Handle Select All/Deselect All
  const handleChangeCheckAll = () => {
    const isChecked = memoListAllProductIds.every(item => selectRows.includes(item));
    setSelectRows(isChecked ? [] : memoListAllProductIds);
  };

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Grid container spacing={4}>
        <Grid item md={12} xs={12}>
          <Box
            sx={{
              width: '100%',
              height: '100%',
              padding: '40px',
              backgroundColor: theme.palette.background.paper,
              borderRadius: '15px',
            }}
          >
            {orderItems.length > 0 && (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    gap: '8px',
                    mb: '10px',
                  }}
                >
                  <Box sx={{ flexBasis: '5%' }}>
                    <Checkbox
                      checked={memoListAllProductIds.every(item => selectRows.includes(item))}
                      onChange={handleChangeCheckAll}
                    />
                  </Box>
                  <Box sx={{ flexBasis: '10%' }}>{t('Cart_product_image')}</Box>
                  <Typography sx={{ flexBasis: '40%' }}>{t('Cart_product_name')}</Typography>
                  <Box sx={{ flexBasis: '25%' }}>{t('Cart_product_price')}</Box>
                  <Box sx={{ flexBasis: '15%' }}>{t('Cart_product_quantity')}</Box>
                  <Box sx={{ flexBasis: '15%' }}>{t('Cart_product_total')}</Box>
                  <Box sx={{ flexBasis: '5%' }}>
                    <Tooltip title={t('Cart_product_remove')}>
                      <IconButton
                        onClick={handleRemoveCartAll}
                        sx={{ color: theme.palette.error.main }}
                        disabled={!selectRows.length}
                      >
                        <Icon icon="mdi:delete-outline" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Divider />
              </>
            )}
            <Box sx={{ width: '100%', gap: '8px', display: 'flex', flexDirection: 'column', mt: '10px' }}>
              {orderItems.map((item: TItemOrderProduct, index: number) => (
                <Box key={item.product} sx={{ display: 'flex', paddingTop: '20px', width: '100%', alignItems: 'flex-start' }}>
                  <Box sx={{ flexBasis: '5%' }}>
                    <Checkbox
                      checked={selectRows.includes(item.product)}
                      value={item.product}
                      onChange={(e) => handleOnChangeCheckBox(e.target.value)}
                    />
                  </Box>
                  <Box sx={{ flexBasis: '10%' }}>
                    <Image src={item.image} alt={item.name} width={60} height={60} />
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '24px',
                      flexBasis: '40%',
                      maxWidth: '100%',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      display: 'block',
                      color: theme.palette.primary.main,
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Box sx={{ flexBasis: '25%' }}>
                    <Typography
                      variant="h4"
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: 'bold',
                        fontSize: '22px',
                      }}
                    >
                      {item.discount > 0 ? (
                        <>{formatNumberToLocal((item.price * (100 - item.discount)) / 100)}</>
                      ) : (
                        <>{formatNumberToLocal(item.price)}</>
                      )}{' '}
                      VND
                    </Typography>
                    {item.discount > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: theme.palette.error.main,
                            fontWeight: 'bold',
                            textDecoration: 'line-through',
                            fontSize: '18px',
                          }}
                        >
                          {formatNumberToLocal(item.price)} VND
                        </Typography>
                        <Box
                          sx={{
                            backgroundColor: hexToRGBA(theme.palette.error.main, 0.42),
                            width: '36px',
                            height: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '3px',
                            padding: '2px',
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              color: theme.palette.error.main,
                              fontSize: '10px',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            - {item.discount} %
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ flexBasis: '15%', display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      onClick={() => handleChangeAmountCart(item, -1)}
                      sx={{ backgroundColor: `${theme.palette.primary.main} !important`, color: `${theme.palette.common.white}` }}
                    >
                      <Icon icon="ic:round-minus" />
                    </IconButton>
                    <CustomTextField
                      onChange={(e) => {
                        const numValue = parseInt(e.target.value, 10);
                        if (!isNaN(numValue)) {
                          handleQuantityChange(item, numValue);
                        }
                      }}
                      value={item.amount}
                      inputProps={{
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                        min: 1,
                        max: 100,
                      }}

                      sx={{
                        '.MuiInputBase-input.MuiFilledInput-input': { width: '30px' },
                        '.MuiInputBase-root.MuiFilledInput-root': {
                          borderTop: 'none',
                          borderLeft: 'none',
                          borderRight: 'none',
                          borderRadius: '0px !important',
                          '&.Mui-focused': {
                            backgroundColor: theme.palette.background.paper,
                            boxShadow: 'none',
                          },
                        },
                        ml: 1,
                        mr: 1,
                      }}
                    />
                    <IconButton
                      onClick={() => handleChangeAmountCart(item, 1)}
                      sx={{ backgroundColor: `${theme.palette.primary.main} !important`, color: `${theme.palette.common.white}` }}
                    >
                      <Icon icon="ic:round-plus" />
                    </IconButton>
                  </Box>
                  <Box sx={{ flexBasis: '15%' }}>
                    <Typography
                      variant="h4"
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: 'bold',
                        fontSize: '22px',
                      }}
                    >
                      {formatNumberToLocal(
                        item.discount > 0
                          ? (item.price * (100 - item.discount)) / 100 * item.amount
                          : item.price * item.amount
                      )}{' '}
                      VND
                    </Typography>
                  </Box>
                  <Box sx={{ flexBasis: '5%' }}>
                    <Tooltip title={t('Cart_product_remove')}>
                      <IconButton
                        onClick={() => handleRemoveCart(item)}
                        sx={{ color: theme.palette.error.main }}
                      >
                        <Icon icon="mdi:delete-outline" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

              ))}
              {orderItems.length > 0 && (
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
              )}
            </Box>
            {!orderItems.length && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                <NoData widthImage='50' heightImage='50' textNoData={t('Cart_is_empty')} />

              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MyCartPage;
