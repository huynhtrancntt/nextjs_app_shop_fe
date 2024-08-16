import { NextPage } from "next";
import { ReactNode } from "react";
import LayoutNotApp from "src/views/layouts/layoutNotApp";
import ChangePasswordPage from "src/views/pages/change-password/index";

type Tp = {

}

const Index: NextPage<Tp> = () => {

    return <><ChangePasswordPage /></>
}

export default Index

Index.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>