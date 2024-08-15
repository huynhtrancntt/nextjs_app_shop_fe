import { CONFIG_API } from 'src/configs/api'
import instanceAxios from 'src/helpers/axios'
import { TParamsCreateRole, TParamsEditRole, TParamsGetRoles } from 'src/types/role'

export const getAllRoles = async (data: { params: TParamsGetRoles }) => {
    try {
        const res = await instanceAxios.get(`${CONFIG_API.ROLE.INDEX}`, data)

        return res.data
    } catch (error) {
        return error
    }
}

export const createRole = async (data: TParamsCreateRole) => {
    try {
        const res = await instanceAxios.post(`${CONFIG_API.ROLE.INDEX}`, data)

        return res.data
    } catch (error: any) {
        return error?.response?.data
    }
}

export const updateRole = async (data: TParamsEditRole) => {
    const { id, ...rests } = data
    try {
        const res = await instanceAxios.put(`${CONFIG_API.ROLE.INDEX}/${id}`, rests)

        return res.data
    } catch (error: any) {
        return error?.response?.data
    }
}

export const deleteRole = async (id: string) => {
    try {
        const res = await instanceAxios.delete(`${CONFIG_API.ROLE.INDEX}/${id}`)

        return res.data
    } catch (error: any) {
        return error?.response?.data
    }
}

export const getDetailsRole = async (id: string) => {
    try {
        const res = await instanceAxios.get(`${CONFIG_API.ROLE.INDEX}/${id}`)

        return res.data
    } catch (error: any) {
        return error?.response?.data
    }
}
