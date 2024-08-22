// ** Config
import axios from 'axios'
import { API_ENDPOINT } from 'src/configs/api'
import instanceAxios from 'src/helpers/axios'

// ** Type
import { TLoginAuth, TRegisterAuth, TChangePassword } from 'src/types/auth'

export const loginAuth = async (data: TLoginAuth) => {
  try {
    const res = await axios.post(`${API_ENDPOINT.AUTH.INDEX}/login`, data)

    return res.data
  } catch (error) {
    return null
  }
}
export const logoutAuth = async () => {
  const res = await axios.post(`${API_ENDPOINT.AUTH.INDEX}/logout`)

  return res.data
}
export const registerAuth = async (data: TRegisterAuth) => {
  try {
    const res = await axios.post(`${API_ENDPOINT.AUTH.INDEX}/register`, data)

    return res.data
  } catch (error) {
    return error
  }
}
export const updateAuthMe = async (data: any) => {
  try {
    const res = await instanceAxios.put(`${API_ENDPOINT.AUTH.INDEX}/me`, data)

    return res.data
  } catch (error) {
    return error
  }
}

export const getAuthMe = async () => {
  try {
    const res = await instanceAxios.get(`${API_ENDPOINT.AUTH.INDEX}/me`)

    return res.data
  } catch (error) {
    return error
  }
}
export const changePasswordMe = async (data: TChangePassword) => {
  try {
    const res = await instanceAxios.patch(`${API_ENDPOINT.AUTH.INDEX}/change-password`, data)

    return res.data
  } catch (error) {
    return error
  }
}
