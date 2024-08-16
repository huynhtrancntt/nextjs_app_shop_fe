/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { useRouter } from 'next/router'
import { ReactNode, ReactElement, useEffect } from 'react'

// @ auth
import { useAuth } from 'src/hooks/useAuth'

// @Configs
import { ACCESS_TOKEN, USER_DATA } from 'src/configs/auth'

import { clearLocalStorage, clearTemporaryToken, getTemporaryToken } from 'src/helpers/storage'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props
  // @ auth
  const authContext = useAuth()
  // @ router
  const router = useRouter()


  useEffect(() => {

    // check page chưa render
    if (!router.isReady) {
      return
    }
    const { temporaryToken } = getTemporaryToken()
    if (authContext.user === null &&
      !window.localStorage.getItem(ACCESS_TOKEN) &&
      !window.localStorage.getItem(USER_DATA) && !temporaryToken) {
      if (router.asPath !== '/' && router.asPath !== '/login') {
        router.replace({
          pathname: '/login',
          query: { returnUrl: router.asPath }
        })
      } else {
        router.replace('/login')
      }
      authContext.setUser(null)
      clearLocalStorage()
    }

  }, [router.route])

  useEffect(() => {
    const handleUnload = () => {
      clearTemporaryToken()
    }
    window.addEventListener('beforeunload', handleUnload)

    return () => {
      window.addEventListener('beforeunload', handleUnload)
    }
  }, [])
  if (authContext.loading || authContext.user === null) {
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard
