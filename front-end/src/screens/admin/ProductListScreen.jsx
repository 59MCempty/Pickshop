import React from 'react'
import { Button, Col, Row, Table } from 'react-bootstrap'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { useDeleteProductMutation, useGetProductsQuery } from '../../redux/slice/productApiSlice.js'
import Loader from '../../components/Loader.jsx'
import Message from '../../components/Message.jsx'
import { useCreateProductMutation } from '../../redux/slice/productApiSlice.js'
import { toast } from 'react-toastify'
import { Link, useParams } from 'react-router-dom'
import Paginate from '../../components/Paginate.jsx'

const ProductListScreen = () => {
    const { pageNumber } = useParams()

    const { data, isLoading, error, refetch } = useGetProductsQuery({ pageNumber })

    const [createProduct, { isLoading: createLoading }] = useCreateProductMutation()

    const [deleteProduct, { isLoading: deleteLoading }] = useDeleteProductMutation()

    const createProductHandler = async () => {
        if (window.confirm('Do you want create new product ? ')) {
            try {
                await createProduct()
                refetch()
                toast.success("Product created!")
            } catch (err) {
                toast.error(err?.data?.message || err.message)
            }
        }
    }

    const deleteProductHandler = async (id) => {
        if (window.confirm('Do you want delete this product ?')) {
            try {
                await deleteProduct(id)
                refetch()
                toast.success('Deleted!')
            } catch (err) {
                toast.error(err?.data?.message || err.message)
            }
        }
    }

    return isLoading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
        <>
            <Row className="align-items-center">
                <Col>
                    <h1>Edit Product</h1>
                </Col>

                <Col className="text-end">
                    <Button className="my-3" onClick={createProductHandler}><FaEdit /> Create Product</Button>
                </Col>

                {createLoading && <Loader />}
                {deleteLoading && <Loader />}
            </Row>

            <Table className="mt-3">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>PRICE</th>
                        <th>CATEGORY</th>
                        <th>BRAND</th>
                    </tr>
                </thead>

                <tbody>

                    {data.products.map((item, index) =>
                        <tr key={index}>
                            <th>{item._id}</th>
                            <th>{item.name}</th>
                            <th>{item.price}</th>
                            <th>{item.category}</th>
                            <th>{item.brand}</th>
                            <th>
                                <Link to={`/admin/product/${item._id}/edit`} className="btn btn-light mx-2">
                                    <FaEdit style={{ color: 'green' }} />
                                </Link>

                                <Button type="button" className="btn btn-light" onClick={() => deleteProductHandler(item._id)}>
                                    <FaTrash style={{ color: 'red' }} />
                                </Button>

                            </th>

                        </tr>
                    )}

                </tbody>
            </Table>
            <Paginate page={data.page} pages={data.pages} isAdmin={true} />
        </>
    )
}

export default ProductListScreen
