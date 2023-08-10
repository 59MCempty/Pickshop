import React, { useState } from 'react'
import FormContainer from '../components/FormContainer.jsx'
import { Button, Form } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { saveShippingAddress } from '../redux/slice/cartSliceReducer.js'
import Checkout from '../components/Checkout.jsx'

const ShippingScreen = () => {
    const cart = useSelector(state => state.cart)

    const { shippingAddress } = cart

    const [address, setAddress] = useState(shippingAddress.address || '')
    const [city, setCity] = useState(shippingAddress.city || '')
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '')
    const [country, setCountry] = useState(shippingAddress.country || '')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(saveShippingAddress({ address, city, country, postalCode }))
        navigate('/payment')
    }

    return (
        <FormContainer>
            <Checkout step1 step2 />
            <h1>Shipping Information</h1>

            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="address" className="my-2">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        placeholder="Enter address"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}></Form.Control>
                </Form.Group>

                <Form.Group controlId="country" className="my-2">
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                        placeholder="Enter country"
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}></Form.Control>
                </Form.Group>

                <Form.Group controlId="city" className="my-2">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                        placeholder="Enter city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}></Form.Control>
                </Form.Group>

                <Form.Group controlId="postalCode" className="my-2">
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control
                        placeholder="Enter postal code"
                        type="postalCode"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}></Form.Control>
                </Form.Group>

                <Button type="submit" variant="primary" className="mt-2" disabled={!address || !city || !postalCode || !country ===  ""}>Continue</Button>
            </Form>
        </FormContainer>
    )
}

export default ShippingScreen
