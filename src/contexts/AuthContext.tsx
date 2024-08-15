// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, LoginParams, ErrCallbackType, UserDataType } from './types'
import { loginAuth, logoutAuth } from 'src/services/auth'
import { CONFIG_API } from 'src/configs/api'
import { clearLocalStorage, setLocalStorage } from 'src/helpers/storage'
import instanceAxios from 'src/helpers/axios'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  const { t } = useTranslation()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
      if (storedToken) {
        setLoading(true)
        await instanceAxios
          .get(CONFIG_API.AUTH.AUTH_ME)
          .then(async response => {
            setLoading(false)
            setUser({ ...response.data.data })
          })
          .catch(() => {
            clearLocalStorage()
            setUser(null)
            setLoading(false)
            if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
              router.replace('/login')
            }
          })
      } else {
        setLoading(false)
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    loginAuth({ email: params.email, password: params.password })
      .then(async response => {
        params.rememberMe
          ? setLocalStorage({
            userData: JSON.stringify(response.data.user),
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token
          })
          : null

        toast.success(t("Login_success"));
        const returnUrl = router.query.returnUrl

        setUser({ ...response.data.user })

        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        console.log(redirectURL)
        if (redirectURL === "/login" || redirectURL === "/") {
          router.replace('/')
        } else {
          router.replace(redirectURL as string)
        }


      })

      .catch(err => {
        setLoading(false);
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {

    // call API
    logoutAuth().then(() => {

    })

    setUser(null)
    clearLocalStorage()
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
