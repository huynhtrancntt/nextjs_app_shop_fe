import { createAsyncThunk } from "@reduxjs/toolkit"
import { registerAuth } from "src/services/auth"

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

