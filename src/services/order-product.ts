// ** Products
import { TParamsCreateOrderProduct } from 'src/types/order-product'

// api endPoint
import { API_ENDPOINT } from 'src/configs/api'

// Axios
import instanceAxios from 'src/helpers/axios'
import axios from 'axios'

export const createOrderProduct = async (data: TParamsCreateOrderProduct) => {
    try {
        const res = await instanceAxios.post(`${API_ENDPOINT.MANAGE_ORDER.ORDER.INDEX}`, data)

        return res.data
    } catch (error: any) {
        return error?.response?.data
    }
}
