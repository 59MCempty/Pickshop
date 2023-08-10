import React, { useEffect } from 'react'
import { useGetOrderDetailsQuery, usePayOrderMutation, useGetPaypalClientIdQuery, useOrderDeliveredMutation } from '../redux/slice/orderApiSlice.js'
import { Link, useParams } from 'react-router-dom'
import Loader from '../components/Loader.jsx'
import Message from '../components/Message.jsx'
import { Col, ListGroup, Row, Image, Card, Button } from 'react-bootstrap'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'

const OrderScreen = () => {
    const { id: orderId } = useParams()

    const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId)

    const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation()

    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer()

    const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPaypalClientIdQuery()

    const { userInfo } = useSelector((state) => state.auth)

    const [updateDeliOrder, { isLoading: deliLoading }] = useOrderDeliveredMutation()


    useEffect(() => {
        if (!errorPayPal && !loadingPayPal && paypal.clientId) {
            const loadPaypalScript = async () => {
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        'client-id': paypal.clientId,
                        currency: 'USD'
                    }
                })
                paypalDispatch({ type: 'setLoadingStatus', value: 'pending' })
            }
            if (order && !order.isPaid) {
                if (!window.paypal) {
                    loadPaypalScript()
                }
            }
        }
    }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch])
    const deliveredOrderHandler = async () => {
        try {
            await updateDeliOrder(orderId)
            refetch()
            toast.success("Delivered!")
        } catch (err) {
            toast.error(err?.data?.message || err.message)
        }
    }

    function onApprove(data, actions) {
        return actions.order.capture().then(async function (details) {
            try {
                await payOrder({ orderId, details })
                // reload message of payment method
                refetch()
                toast.success('Payment successfully!')
            } catch (err) {
                toast.error(err?.data?.message || err.message)
            }
        })
    }

    // async function onApproveTest() {
    //     await payOrder({ orderId, details: { payer: {} } })
    //     // reload message of payment method
    //     refetch()
    //     toast.success('Payment successfull')
    // }

    function createOrder(data, actions) {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: order.totalPrice
                    }
                }
            ]
        }).then((orderId) => {
            return orderId
        })
    }

    function onError(err) {
        toast.error(err.message)
    }

    return isLoading ? <Loader /> :
        error ? (<Message variant="danger" />) :
            (<div>
                <h1>Order {order._id}</h1>
                <Row>
                    <Col md={8}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>Shipping</h2>
                                <p>
                                    <strong>Name:</strong>
                                    {order?.user?.name }
                                </p>

                                <p>
                                    <strong>Email:</strong>
                                    {order?.user?.email}
                                </p>

                                <p>
                                    <strong>Address:</strong>
                                    {order.shippingAddress.address}, {order.shippingAddress.country}{' '}
                                    {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                                </p>
                                <p>
                                    {order.isDelivered ? (
                                        <Message variant="success">
                                            Delivered at {order.deliveredAt}
                                        </Message>
                                    ) : (
                                        <Message variant="danger">Not Delivered</Message>
                                    )}
                                </p>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <h2>Payment Method</h2>
                                <p>
                                    <strong>Method:</strong>
                                    {order.paymentMethod}
                                </p>
                                {order.isPaid ? (<Message variant="success">
                                    Paid at {order.paidAt}
                                </Message>) : (
                                    <Message variant="danger">Not Paid</Message>
                                )}
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <h2>Order Items</h2>
                                {order.orderItems.map((item, index) => (
                                    <ListGroup.Item key={index}>
                                        <Row>
                                            <Col md={1}>
                                                <Image src={item.image} alt={item.name} fluid rounded>
                                                </Image>
                                            </Col>
                                            <Col>
                                                <Link to={`/product/${item.product}`}>{item.name}</Link>
                                            </Col>
                                            <Col md={4}>
                                                {item.qty} * ${item.price} = ${item.qty * item.price}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h2>Order Summary</h2>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>Items</Col>
                                        <Col>${order.itemsPrice}</Col>
                                    </Row>

                                    <Row>
                                        <Col>Shipping</Col>
                                        <Col>${order.shippingPrice}</Col>
                                    </Row>

                                    <Row>
                                        <Col>Tax Price</Col>
                                        <Col>${order.taxPrice}</Col>
                                    </Row>

                                    <Row>
                                        <Col>Total Price</Col>
                                        <Col>${order.totalPrice}</Col>
                                    </Row>
                                </ListGroup.Item>

                                {!order.isPaid && (
                                    <ListGroup.Item>
                                        {loadingPay && <Loader />}

                                        {isPending ? <Loader /> : (

                                            <div>
                                                <PayPalButtons
                                                    onApprove={onApprove}
                                                    createOrder={createOrder}
                                                    onError={onError}
                                                />
                                            </div>

                                        )}
                                    </ListGroup.Item>
                                )}

                                {userInfo && userInfo.isAdmin && !order.isDelivered && order.isPaid && (
                                    <ListGroup.Item>
                                        <Button
                                            onClick={deliveredOrderHandler}
                                            type="button"
                                            className="btn btn-block">
                                            Mark as delivered
                                        </Button>
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </div>)
}

export default OrderScreen
