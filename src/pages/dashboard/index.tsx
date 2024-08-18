// ** Next
import { NextPage } from 'next'
// ** Permission
import { PERMISSIONS } from 'src/configs/permission'
// ** Views

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <h1>This is Dashboard</h1>
}

Index.permission = [PERMISSIONS.DASHBOARD]
export default Index
