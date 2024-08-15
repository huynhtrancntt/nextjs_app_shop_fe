import { createAsyncThunk } from "@reduxjs/toolkit"
import { registerAuth, updateAuthMe } from "src/services/auth"

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


