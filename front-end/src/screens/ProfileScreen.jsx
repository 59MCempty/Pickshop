import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Col, Form, Row, Table } from 'react-bootstrap'

import { useProfileMutation } from '../redux/slice/userApiSlice.js'
import { useGetMyOrderQuery } from '../redux/slice/orderApiSlice.js'
import Loader from '../components/Loader.jsx'
import { setCredential } from '../redux/slice/authSliceReducer.js'
import { toast } from 'react-toastify'
import Message from '../components/Message.jsx'
import { FaTimes } from 'react-icons/fa'
import { LinkContainer } from 'react-router-bootstrap'

const ProfileScreen = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')


    const { userInfo } = useSelector((state) => state.auth)

    const [updateProfile, { isLoading }] = useProfileMutation()
    const dispatch = useDispatch()
    const { data: myOrder, isLoading: orderLoading, error } = useGetMyOrderQuery()

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            if (password === confirmPassword) {
                const res = await updateProfile({ _id: userInfo._id, name, email, password }).unwrap()
                dispatch(setCredential(res))
                toast.success('Update profile successfully!')
            } else {
                toast.error('Password do not match!')
            }
        } catch (err) {
            toast.error(err?.data?.message || err.message)
        }
    }

    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name)
            setEmail(userInfo.email)
        }
    }, [userInfo, userInfo.name, userInfo.email])

    return (
        <Row>
            <Col md={3}>
                <h2>User Profile</h2>

                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="name" className="my-2">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            placeholder="Enter your username"
                            type="text">
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="email" className="my-2">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            placeholder="Enter your email"
                            type="text">
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="password" className="my-2">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            placeholder="Enter your password"
                            type="text">
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="confirm-password" className="my-2">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            value={confirmPassword}
                            placeholder="Confirm Password"
                            type="text">
                        </Form.Control>
                    </Form.Group>

                    <Button type="submit" variant="primary" className="mt-2">Update Profile</Button>
                    {isLoading && <Loader />}
                </Form>
            </Col>
            <Col md={9}>
                <h2>My Orders</h2>
                {orderLoading ? <Loader /> :
                    error ? (<Message>{error?.data?.message || error.message}</Message>) : (
                        <Table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>DATE</th>
                                    <th>TOTAL</th>
                                    <th>PAID</th>
                                    <th>DELIVERED</th>
                                </tr>
                            </thead>

                            <tbody>
                                {myOrder?.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item._id}</td>
                                        <td>{item.createdAt.substring(0, 10)}</td>
                                        <td>${item.totalPrice}</td>
                                        <td>{item.isPaid ? item.paidAt.substring(0, 10) : <FaTimes style={{ color: 'red' }} />}</td>
                                        <td>{item.isDelivered ? item.deliveredAt.substring(0, 10) : <FaTimes style={{ color: 'red' }} />}</td>
                                        <td>
                                            <LinkContainer to={`/order/${item._id}`}>
                                                <Button type="button" variant="light">Details</Button>
                                            </LinkContainer>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
            </Col>
        </Row>
    )
}

export default ProfileScreen
