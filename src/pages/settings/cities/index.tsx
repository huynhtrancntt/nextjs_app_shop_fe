// ** Import Next
import { NextPage } from 'next'
// ** Configs
import { PERMISSIONS } from 'src/configs/permission'
// ** Pages
import CityListPage from 'src/views/pages/settings/city/CityList'

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <CityListPage />
}

Index.permission = [PERMISSIONS.SETTING.CITY.VIEW]
export default Index
