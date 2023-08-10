import { useEffect, useState } from 'react'
import FormContainer from '../components/FormContainer.jsx'
import { Form, Row, Col, Button } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { useLoginMutation } from '../redux/slice/userApiSlice.js'
import { setCredential } from '../redux/slice/authSliceReducer.js'
import { toast } from 'react-toastify'
import Loader from '../components/Loader.jsx'

const LoginScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [login, { isLoading }] = useLoginMutation()

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
        try {
            const res = await login({ email, password }).unwrap()
            dispatch(setCredential({ ...res }))
            navigate(redirect)
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    }


    return (
        <FormContainer>
            <h1>Sign In</h1>

            <Form onSubmit={submitHandle}>
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
                    <Form.Label>Enter</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button type="submit" variant="success" className="mt-3" disabled={isLoading}>Sign In</Button>

                {isLoading && <Loader />}
            </Form>
            <Row className="py-3">
                <Col>
                    New Customer ? <Link to={`${redirect ? `/register/?redirect=${redirect}` : '/register'}`}>Register</Link>
                </Col>
            </Row>

        </FormContainer>
    )
}

export default LoginScreen
