import axios from 'axios'

// Config
import { API_ENDPOINT } from 'src/configs/api'
// import instanceAxios from 'src/helpers/axios'

// Type
import { TLoginAuth } from 'src/types/auth'


export const loginAuth = async (data: TLoginAuth) => {
    try {
        const res = await axios.post(`${API_ENDPOINT.AUTH.INDEX}/login`, data)

        return res.data
    } catch (error) {
        return null
    }
}
