

export type TVertical = {
    title: string
    path?: string
    icon: string
    childrens?: {
        title: string
        path?: string
        icon: string
    }[]
}

export const VerticalItems = () => {
    return [
        {
            title: "System  ",
            icon: 'eos-icons:file-system-outlined',
            childrens: [
                {
                    title: "User",
                    icon: 'iconoir:group',
                    path: "/"
                },
                {
                    title: "Role",
                    icon: 'icon-park-outline:permissions',
                    path: "/"
                }
                ,
                {
                    title: "Role2",
                    icon: 'icon-park-outline:permissions',
                    path: "/"
                }
            ]
        }
    ]
}
