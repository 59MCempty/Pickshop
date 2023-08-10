import React from 'react'
import { useGetOrdersQuery } from '../../redux/slice/orderApiSlice.js'
import Message from '../../components/Message.jsx'
import Loader from '../../components/Loader.jsx'
import { Button, Table } from 'react-bootstrap'
import { FaTimes } from 'react-icons/fa'
import { LinkContainer } from 'react-router-bootstrap'

const OrderListScreen = () => {
    const { data: orders, isLoading, error } = useGetOrdersQuery()

    return isLoading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (

        <>
            <h1>All Order</h1>
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
                    {orders?.map((item, index) =>
                        <tr key={index}>
                            <td>{item._id}</td>
                            <td>{item.createdAt.substring(0, 10)}</td>
                            <td>${item.totalPrice}</td>
                            <td>{item.isPaid ? item.paidAt.substring(0, 10) : <FaTimes style={{color: "red"}} />}</td>
                            <td>{item.isDelivered ? item.deliveredAt.substring(0, 10) : <FaTimes style={{ color: 'red' }} />}</td>
                            <td>
                                <LinkContainer to={`/order/${item._id}`}>
                                    <Button>Details</Button>
                                </LinkContainer>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table></>
    )


}

export default OrderListScreen
