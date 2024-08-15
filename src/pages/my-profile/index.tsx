// ** Import Next
import { NextPage } from 'next'
import { ReactNode } from 'react'
// ** views
import LayoutNotApp from 'src/views/layouts/layoutNotApp'
import MyProfilePage from 'src/views/pages/my-profile'



type TProps = {}

const Index: NextPage<TProps> = () => {
    return <><MyProfilePage /></>
}

export default Index
Index.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
