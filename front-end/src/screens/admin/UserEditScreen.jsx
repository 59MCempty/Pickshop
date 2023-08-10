import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useGetUserDetailsQuery, useUpdateUserMutation } from '../../redux/slice/userApiSlice.js'
import FormContainer from '../../components/FormContainer.jsx'
import { Button, Form, FormGroup } from 'react-bootstrap'
import { toast } from 'react-toastify'
import Loader from '../../components/Loader.jsx'


const UserEditScreen = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)

    const { id: userId } = useParams()

    const { data: userDetails, isLoading, error, refetch } = useGetUserDetailsQuery(userId)

    const [updateUser, { isLoading: updateLoading }] = useUpdateUserMutation()

    const submitHandler = async (e) => {
        e.preventDefault()
        const user = {
            userId,
            name,
            email,
            isAdmin
        }

        try {
            await updateUser(user)
            toast.success('Updated!')
            refetch()
        } catch (err) {
            toast.error(err?.data?.message || err.message)
        }
    }
    return (
        <>
            <Link to="/admin/userlist" className="btn btn-light">Go Back</Link>
            <FormContainer>
                <h1>Update User</h1>
                {updateLoading && <Loader />}
                {isLoading && <Loader />}
                {userDetails && (
                    <Form onSubmit={submitHandler}>
                        <FormGroup controlId="name" className="my-2">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                placeholder={userDetails.name}
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            ></Form.Control>
                        </FormGroup>


                        <FormGroup controlId="email" className="my-2">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                placeholder={userDetails.email}
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            ></Form.Control>
                        </FormGroup>

                        <FormGroup controlId="isAdmin" className="my-2">
                            <Form.Check
                                type="checkbox"
                                label="Is admin"
                                checked={userDetails.isAdmin}
                                onChange={(e) => setIsAdmin(e.target.checked)}
                            >

                            </Form.Check>
                        </FormGroup>

                        <Button type="submit" variant="success" className="mt-2">Update</Button>
                    </Form>
                )}


            </FormContainer>
        </>
    )
}

export default UserEditScreen
