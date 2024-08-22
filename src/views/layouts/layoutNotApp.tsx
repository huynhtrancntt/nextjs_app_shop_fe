// ** React
import * as React from 'react'

// ** next
import { NextPage } from 'next'

// ** Mui
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'

// ** views
import HorizontalLayout from 'src/views/layouts/horizontalLayout'

import { useTheme } from '@mui/material'

type TProps = {
  children: React.ReactNode
}

const LayoutNotApp: NextPage<TProps> = ({ children }) => {
  const theme = useTheme()

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <HorizontalLayout toggleDrawer={() => { }} open={false} isHideMenu />
      <Box
        component='main'
        sx={{
          backgroundColor: theme =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto'
        }}
      >
        <Toolbar />
        <Container
          sx={{
            m: 4,
            width: 'calc(100vw - 48px)',
            maxWidth: 'unset !important',

            padding: '0 !important',
            borderRadius: '15px',
            margin: '8px',
            marginLeft: '16px !important',

          }}
        >

          {children}
        </Container>
      </Box>
    </Box >
  )
}

export default LayoutNotApp
