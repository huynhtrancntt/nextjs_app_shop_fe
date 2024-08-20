import {
  Box,
  InputLabel,
  InputLabelProps,
  MenuItem,
  MenuItemProps,
  Select,
  BaseSelectProps,
  styled
} from '@mui/material'
import { useTranslation } from 'react-i18next'

interface TCustomSelect extends BaseSelectProps {
  options: { label: string; value: string }[]
}

const StyledSelect = styled(Select)<BaseSelectProps>(({ theme }) => ({
  '& .MuiSelect-select.MuiSelect-outlined.MuiInputBase-input': {
    padding: '8px 8px 8px 8px !important',
    height: '38px',
    boxSizing: 'border-box'
  },
  legend: {
    display: 'none'
  },
  svg: {
    top: 'calc(50% - .6em) !important'
  },
  '.MuiOutlinedInput-notchedOutline': {
    top: '-0px !important',
    bottom: '2px !important',
    height: '38px',
    border: `1px solid ${theme.palette.customColors.borderColor}`
    ,
  },
}))

const CustomPlaceHolder = styled(InputLabel)<InputLabelProps>(({ theme }) => ({
  position: 'absolute',
  top: '8px',
  left: '10px',
  zIndex: 2
}))

const StyledMenuItem = styled(MenuItem)<MenuItemProps>(({ theme }) => ({}))

const CustomSelect = (props: TCustomSelect) => {
  const { value, label, onChange, fullWidth, placeholder, options, ...rest } = props
  const { t } = useTranslation()

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      {((Array.isArray(value) && !value.length) || !value) && <CustomPlaceHolder>{placeholder}</CustomPlaceHolder>}
      <StyledSelect fullWidth={fullWidth} value={value} label={label} onChange={onChange} {...rest}>
        {options?.length > 0 ? (
          options?.map(opt => {
            return (
              <StyledMenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </StyledMenuItem>
            )
          })
        ) : (
          <StyledMenuItem>{t('no_data')}</StyledMenuItem>
        )}
      </StyledSelect>
    </Box>
  )
}

export default CustomSelect
