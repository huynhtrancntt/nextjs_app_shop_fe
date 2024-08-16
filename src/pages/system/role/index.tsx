
import Head from 'next/head'
import RoleListPage from 'src/views/pages/system/role/RoleList'
// import LayoutNotApp from 'src/views/layouts/layoutNotApp'

const Index = () => {

  return (
    <>
      <RoleListPage />
    </>
  )
}
export default Index

// ManageSystem.getLayout = (page: React.ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
// Index.gusetGuard = true