// ** Next
import { NextPage } from 'next'
// ** Pages
import RoleListPage from 'src/views/pages/system/role/RoleList'
// ** Views

import { PERMISSIONS } from 'src/configs/permission'

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <RoleListPage />
}

Index.permission = [PERMISSIONS.SYSTEM.ROLE.VIEW]
export default Index
