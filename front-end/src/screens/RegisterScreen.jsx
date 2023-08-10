import React, { useEffect, useState } from 'react'
import FormContainer from '../components/FormContainer.jsx'
import { Form, Row, Col, Button } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { useRegisterMutation } from '../redux/slice/userApiSlice.js'
import { userRegister } from '../redux/slice/authSliceReducer.js'
import { toast } from 'react-toastify'
import Loader from '../components/Loader.jsx'

const RegisterScreen = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [register, { isLoading }] = useRegisterMutation()

    // params
    const { search } = useLocation()
    const sp = new URLSearchParams(search)
    const redirect = sp.get('redirect') || '/'

    const { userInfo } = useSelector((state) => state.auth)

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [redirect, userInfo, navigate])

    const submitHandle = async (e) => {
        e.preventDefault()
        if (password === confirmPassword) {
            try {
                const res = await register({ name, email, password }).unwrap()
                console.log(res)
                dispatch(userRegister({ ...res }))
                navigate(redirect)
            } catch (err) {
                toast.error(err?.data?.message || err.error)
            }
        } else {
            toast.error('Passwords do not match')
        }
    }


    return (
        <FormContainer>
            <h1>Register New User</h1>

            <Form onSubmit={submitHandle}>
                <Form.Group controlId="name" className="my-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="name"
                        placeholder="Enter Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId="email" className="my-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId="password" className="my-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId="confirm-password" className="my-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="ConfirmPassword"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button type="submit" variant="success" className="mt-3" disabled={isLoading}>Sign Up</Button>

                {isLoading && <Loader />}
            </Form>
            <Row className="py-3">
                <Col>
                    Already have account ?{' '} <Link to={`${redirect ? `/login/?redirect=${redirect}` : '/login'}`}>Log In</Link>
                </Col>
            </Row>

        </FormContainer>
    )
}

export default RegisterScreen
