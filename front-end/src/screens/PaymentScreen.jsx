import React, { useEffect, useState } from 'react'
import FormContainer from '../components/FormContainer.jsx'
import Checkout from '../components/Checkout.jsx'
import { Button, Card, Col, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { paymentMethod } from '../redux/slice/cartSliceReducer.js'

const PaymentScreen = () => {
    const [payment, setPayment] = useState('PayPal')

    const cart = useSelector((state) => state.cart)

    const { shippingAddress } = cart
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
        if (!shippingAddress) {
            navigate('/shipping')
        }
    }, [shippingAddress, navigate])
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(paymentMethod(payment))
        navigate('/placeorder')
    }

    return (
        <FormContainer>
            <Checkout step1 step2 step3 />
            <h1>Payment Method</h1>

            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as="legend">Select Method</Form.Label>
                    <Col>
                        <Form.Check
                            type="radio"
                            className="my-2"
                            label="PayPal or Credit Card"
                            id="paymentMethod"
                            value="PayPal"
                            checked
                            onChange={(e) => setPayment(e.target.value)}
                        ></Form.Check>
                    </Col>
                </Form.Group>
                <Button type="submit" variant="primary" className="mt-2">
                    Continue
                </Button>
            </Form>

        </FormContainer>
    )
}

export default PaymentScreen
