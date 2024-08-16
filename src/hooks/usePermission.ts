import { useEffect, useState } from 'react'
import { PERMISSIONS } from 'src/configs/permission'
import { useAuth } from 'src/hooks/useAuth'

type TActions = 'CREATE' | 'VIEW' | 'UPDATE' | 'DELETE'

type PermissionsMap = Record<TActions, string>

// Giả định rằng userPermission là một mảng chuỗi
type UserPermissions = string[]

export const usePermission = (key: string, actions: TActions[]) => {
    const { user } = useAuth()
    const defaultValues: Record<TActions, boolean> = {
        VIEW: false,
        CREATE: false,
        UPDATE: false,
        DELETE: false
    }

    const getObjectValue = <T extends Record<string, any>>(obj: T, key: string): T | undefined => {
        const keys = key.split('.')
        let result: any = obj
        if (keys && !!key.length) {
            for (const k of keys) {
                if (k in result) {
                    result = result[k]
                } else {
                    return undefined
                }
            }
        }

        return result
    }

    // Xác định kiểu của userPermission là mảng chuỗi
    const userPermission: UserPermissions | undefined = user?.role?.permissions

    const [permission, setPermission] = useState(defaultValues)

    useEffect(() => {
        const mapPermission = getObjectValue<PermissionsMap>(PERMISSIONS, key)

        if (mapPermission && userPermission) {
            const updatedPermissions = { ...defaultValues }
            actions.forEach(mode => {
                if (userPermission.includes(PERMISSIONS.ADMIN)) {
                    updatedPermissions[mode] = true
                } else if (userPermission.includes(mapPermission[mode])) {
                    updatedPermissions[mode] = true
                } else {
                    updatedPermissions[mode] = false
                }
            })
            setPermission(updatedPermissions)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.role, actions, key])

    return permission
}
