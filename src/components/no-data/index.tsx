// ** MUI
import Box, { BoxProps } from '@mui/material/Box'
import { Typography } from '@mui/material'
// ** Component
import NoDataImage from '/public/svgs/no-data.svg'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'


type TProps = {
  widthImage?: string,
  heightImage?: string,
  textNoData?: string

}
const NoData = (props: TProps) => {

  const { t } = useTranslation()

  const { widthImage = '100px', heightImage = '100px', textNoData = t('No-data') } = props

  return (

    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,

      }}
    >
      <Image
        src={NoDataImage}
        alt='avatar'
        width={0}
        height={0}
        style={{
          height: widthImage,
          width: heightImage,
          objectFit: 'cover',

        }} />
      <Typography sx={{ whiteSpace: 'nowrap', mt: 2 }}>
        {textNoData}
      </Typography>
    </Box>
  )
}
export default NoData
