import { createAsyncThunk } from "@reduxjs/toolkit"
import { changePasswordMe, registerAuth, updateAuthMe } from "src/services/auth"
import { TChangePassword } from "src/types/auth"

// ** register Auth
export const registerAuthAsync = createAsyncThunk(
    'auth/register',
    async (data: any) => {


        const response = await registerAuth(data)
        if (response.data) {
            return response
        } else {
            return {
                data: null,
                message: response?.response?.data?.message,
                typeError: response?.response?.data?.typeError
            }
        }



    }
)
// ** update Auth
export const updateAuthMeAsync = createAsyncThunk(
    'auth/updateAuthMe',
    async (data: any) => {


        const response = await updateAuthMe(data)
        if (response.data) {
            return response
        } else {
            return {
                data: null,
                message: response?.response?.data?.message,
                typeError: response?.response?.data?.typeError
            }
        }



    }
)
// ** Change Password
export const changePasswordMeAsync = createAsyncThunk('auth/change-password-me', async (data: TChangePassword) => {
    const response = await changePasswordMe(data)

    if (response?.status === 'Success') {
        return { ...response, data: 1 }
    }

    return {
        data: null,
        message: response?.response?.data?.message,
        typeError: response?.response?.data?.typeError
    }
})

