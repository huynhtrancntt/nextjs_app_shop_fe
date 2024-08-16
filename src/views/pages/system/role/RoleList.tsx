// ** Next
import { NextPage } from 'next'

// ** React
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** Mui
import { Box, Grid, useTheme } from '@mui/material'
import { deleteRoleAsync, getAllRolesAsync } from 'src/stores/apps/role/actions'
import { GridColDef, GridSortModel } from '@mui/x-data-grid'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState } from 'src/stores/apps/role'

// ** Components
import GridDelete from 'src/components/grid-delete'
import GridEdit from 'src/components/grid-edit'

import GridCreate from 'src/components/grid-create'
import InputSearch from 'src/components/input-search'
// import CreateEditRole from 'src/views/pages/system/role/components/CreateEditRole'
import CustomDataGrid from 'src/components/custom-data-grid'
import Spinner from 'src/components/spinner'

// ** Others
import toast from 'react-hot-toast'
// import ConfirmationDialog from 'src/components/confirmation-dialog'
import Icon from 'src/components/Icon'
import { OBJECT_TYPE_ERROR_ROLE } from 'src/configs/role'

type TProps = {}

const RoleListPage: NextPage<TProps> = () => {
    // State
    const [openCreateEdit, setOpenCreateEdit] = useState({
        open: false,
        id: ''
    })
    const [openDeleteRole, setOpenDeleteRole] = useState({
        open: false,
        id: ''
    })
    const [sortBy, setSortBy] = useState('created asc')
    const [searchBy, setSearchBy] = useState('')

    // ** Translate
    const { t } = useTranslation()

    /// ** redux
    const dispatch: AppDispatch = useDispatch()
    const {
        roles,
        isSuccessCreateEdit,
        isErrorCreateEdit,
        isLoading,
        messageErrorCreateEdit,
        isErrorDelete,
        isSuccessDelete,
        messageErrorDelete,
        typeError
    } = useSelector((state: RootState) => state.role)

    // ** theme
    const theme = useTheme()

    // fetch api

    const handleGetListRoles = () => {
        dispatch(getAllRolesAsync({ params: { limit: -1, page: -1, search: searchBy, order: sortBy } }))
    }

    // handle
    const handleCloseConfirmDeleteRole = () => {
        setOpenDeleteRole({
            open: false,
            id: ''
        })
    }

    const handleSort = (sort: GridSortModel) => {
        const sortOption = sort[0]
        setSortBy(`${sortOption.field} ${sortOption.sort}`)
    }

    const handleCloseCreateEdit = () => {
        setOpenCreateEdit({
            open: false,
            id: ''
        })
    }

    const handleDeleteRole = () => {
        dispatch(deleteRoleAsync(openDeleteRole.id))
    }

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: t('Name'),
            flex: 1
        },
        {
            field: 'action',
            headerName: t('Actions'),
            minWidth: 150,
            sortable: false,
            align: 'left',
            renderCell: params => {
                const { row } = params

                return (
                    <Box sx={{ width: '100%' }}>
                        {!row?.permissions?.some((per: string) => ['ADMIN.GRANTED', 'BASIC.PUBLIC']?.includes(per)) ? (
                            <>
                                <GridEdit
                                    onClick={() =>
                                        setOpenCreateEdit({
                                            open: true,
                                            id: String(params.id)
                                        })
                                    }
                                />
                                <GridDelete
                                    onClick={() =>
                                        setOpenDeleteRole({
                                            open: true,
                                            id: String(params.id)
                                        })
                                    }
                                />
                            </>
                        ) : (
                            <Icon icon='material-symbols-light:lock-outline' fontSize={30} />
                        )}
                    </Box>
                )
            }
        }
    ]

    useEffect(() => {
        handleGetListRoles()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortBy, searchBy])

    useEffect(() => {
        if (isSuccessCreateEdit) {
            if (openCreateEdit.id) {
                toast.success(t('Update-role-success'))
            } else {
                toast.success(t('Create_role_success'))
            }
            handleGetListRoles()
            handleCloseCreateEdit()
            dispatch(resetInitialState())
        } else if (isErrorCreateEdit && messageErrorCreateEdit && typeError) {
            const errorConfig = OBJECT_TYPE_ERROR_ROLE[typeError]
            if (errorConfig) {
                toast.error(t(errorConfig))
            } else {
                if (openCreateEdit.id) {
                    toast.error(t('Update-role-error'))
                } else {
                    toast.error(t('Create_role_error'))
                }
            }
            dispatch(resetInitialState())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessCreateEdit, isErrorCreateEdit, messageErrorCreateEdit, typeError])

    useEffect(() => {
        if (isSuccessDelete) {
            toast.success(t('delete-role-success'))
            handleGetListRoles()
            dispatch(resetInitialState())
            handleCloseConfirmDeleteRole()
        } else if (isErrorDelete && messageErrorDelete) {
            toast.error(t(messageErrorDelete))
            dispatch(resetInitialState())
        }
    }, [isSuccessDelete, isErrorDelete, messageErrorDelete])

    return (
        <>
            {/* <ConfirmationDialog
                open={openDeleteRole.open}
                handleClose={handleCloseConfirmDeleteRole}
                handleCancel={handleCloseConfirmDeleteRole}
                handleConfirm={handleDeleteRole}
                title={t('Title_delete_role')}
                description={t('Confirm_delete_role')}
            /> */}
            {/* <CreateEditRole open={openCreateEdit.open} onClose={handleCloseCreateEdit} idRole={openCreateEdit.id} /> */}
            {isLoading && <Spinner />}
            <Box
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '20px',
                    height: '100% ',

                }}
            >
                <Grid container sx={{ height: '100%', width: '100%' }}>
                    <Grid item md={5} xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Box sx={{ width: '200px' }}>
                                <InputSearch value={searchBy} onChange={(value: string) => setSearchBy(value)} />
                            </Box>
                            <GridCreate
                                onClick={() =>
                                    setOpenCreateEdit({
                                        open: true,
                                        id: ''
                                    })
                                }
                            />
                        </Box>
                        <CustomDataGrid
                            rows={roles.data}
                            columns={columns}
                            pageSizeOptions={[5]}
                            autoHeight
                            hideFooter
                            sortingOrder={['desc', 'asc']}
                            sortingMode='server'
                            onSortModelChange={handleSort}
                            getRowId={row => row._id}
                            disableRowSelectionOnClick
                            disableColumnFilter
                            disableColumnMenu
                        />
                    </Grid>
                    <Grid item md={7} xs={12}>
                        List permission
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default RoleListPage
