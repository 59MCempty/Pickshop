import React from 'react'
import { useDeleteUserMutation, useGetUsersQuery } from '../../redux/slice/userApiSlice.js'
import Loader from '../../components/Loader.jsx'
import Message from '../../components/Message.jsx'
import { Button, Table } from 'react-bootstrap'
import { FaCheck, FaEdit, FaTimes, FaTrash } from 'react-icons/fa'
import { LinkContainer } from 'react-router-bootstrap'
import { toast } from 'react-toastify'

const UserListScreen = () => {

    const { data: users, isLoading, error, refetch } = useGetUsersQuery()

    const [deleteUser, {isLoading: deleteLoading}] = useDeleteUserMutation()

    const deleteUserHandler = async (id) => {
        if(window.confirm("Do you want delete user ?")) {
            try {
                await deleteUser(id)
                toast.success("Deleted!")
                refetch()
            }
            catch (err) {
                toast.error(err?.data?.message || err.message)
            }
        }
    }

    return (
        <>
            <h1>Users</h1>
            {deleteLoading && <Loader />}
            {isLoading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
                <Table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>IS ADMIN</th>
                        </tr>
                    </thead>

                    <tbody>

                        {users?.map((user, index) =>
                            <tr key={index}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>
                                    <a href={`mailto:${user.email}`}>{user.email}</a>
                                </td>
                                <td>{user.isAdmin ? <FaCheck style={{ color: 'green' }} /> : <FaTimes style={{ color: 'red' }} />}</td>
                                <td>
                                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                        <Button type="button" variant="light" className="btn-sm mx-2"><FaEdit /></Button>
                                    </LinkContainer>
                                    <Button type="button" variant="danger" className="btn-sm" onClick={() => deleteUserHandler(user._id)}><FaTrash /></Button>
                                </td>
                            </tr>
                        )}

                    </tbody>
                </Table>
            )}
        </>
    )
}

export default UserListScreen
