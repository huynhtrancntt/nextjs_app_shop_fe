// ** React
import { createContext, useEffect, useState, ReactNode, use } from 'react'
// ** Next
import { useRouter } from 'next/router'
// ** Config
import authConfig from 'src/configs/auth'
// ** Types
import { AuthValuesType, LoginParams, ErrCallbackType, UserDataType } from './types'
// ** Services
import { loginAuth, logoutAuth } from 'src/services/auth'
// ** Config
import { API_ENDPOINT } from 'src/configs/api'
// ** Helper
import { clearLocalUserData, setLocalUserData, setTemporaryToken } from 'src/helpers/storage'
// ** Axios
import instanceAxios from 'src/helpers/axios'
// ** Translate
import { useTranslation } from 'react-i18next'
// ** Others
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/stores'
import { addProductToCart } from 'src/stores/order-product'

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
  // Translate
  const { t } = useTranslation()
  // ** Hooks
  const router = useRouter()

  const dispatch: AppDispatch = useDispatch()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      if (storedToken) {
        setLoading(true)
        await instanceAxios
          .get(API_ENDPOINT.AUTH.AUTH_ME)
          .then(async response => {
            setLoading(false)
            setUser({ ...response.data.data })
          })
          .catch(() => {
            clearLocalUserData()
            setUser(null)
            setLoading(false)
            if (!router.pathname.includes('login')) {
              router.replace('/login')
            }
          })
      } else {
        setLoading(false)
      }
    }
    initAuth()
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    loginAuth({ email: params.email, password: params.password })
      .then(async response => {
        if (params.rememberMe) {
          setLocalUserData(JSON.stringify(response.data.user), response.data.access_token, response.data.refresh_token)
        } else {
          setTemporaryToken(response.data.access_token)
        }
        toast.success(t('Login_success'))
        const returnUrl = router.query.returnUrl
        setUser({ ...response.data.user })
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        router.replace(redirectURL as string)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }
  const handleLogout = () => {
    logoutAuth().then(res => {
      setUser(null)
      clearLocalUserData()
      dispatch(
        addProductToCart({
          orderItems: []
        })
      )
      //router.push('/login')
    })
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
