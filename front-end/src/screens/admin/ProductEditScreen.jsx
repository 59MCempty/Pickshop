import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useGetProductDetailsQuery, useUpdateProductMutation, useUploadImageProductMutation } from '../../redux/slice/productApiSlice.js'
import Loader from '../../components/Loader.jsx'
import Message from '../../components/Message.jsx'
import { Button, Form, FormGroup } from 'react-bootstrap'
import FormContainer from '../../components/FormContainer.jsx'
import { toast } from 'react-toastify'

const ProductEditScreen = () => {
    const { id: productId } = useParams()

    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [countInStock, setCountInStock] = useState('')

    const navigate = useNavigate()

    const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId)
    const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation()
    const [uploadImageProduct, { isLoading: uploadLoading }] = useUploadImageProductMutation()

    useEffect(() => {
        if (product) {
            setName(product.name)
            setImage(product.image)
            setPrice(product.price)
            setBrand(product.brand)
            setDescription(product.description)
            setCategory(product.category)
            setCountInStock(product.countInStock)
        }
    }, [product])


    const uploadFileHandler = async (e) => {
        const formData = new FormData()
        formData.append('image', e.target.files[0])
        try {
            const res = await uploadImageProduct(formData).unwrap()
            toast.success(res.message)
            setImage(res.image)

            return image
        } catch (err) {
            toast.error(err?.data?.message || err.message)
        }

    }

    const submitHandler = async (e) => {
        e.preventDefault()
        const product = {
            productId,
            name,
            price,
            image,
            brand,
            description,
            category,
            countInStock
        }
        const result = await updateProduct(product)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Product updated!')
            navigate('/admin/productlist')
        }
    }


    return (
        <div>
            <Link to="/admin/productlist" className="btn btn-light mx-2">Go Back</Link>
            <FormContainer>
                <h1>Edit Product</h1>


                {isLoading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="name"
                                placeholder="Enter name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="price">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="image">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter image url"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                            ></Form.Control>
                            <Form.Control
                                label="Choose File"
                                onChange={uploadFileHandler}
                                type="file"
                            ></Form.Control>
                            {uploadLoading && <Loader />}
                        </Form.Group>
                        {loadingUpdate && <Loader />}

                        <Form.Group controlId="brand">
                            <Form.Label>Brand</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter brand"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                            ></Form.Control>
                        </Form.Group>


                        <Form.Group controlId="countInStock">
                            <Form.Label>Count In Stock</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter countInStock"
                                value={countInStock}
                                onChange={(e) => setCountInStock(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="category">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            ></Form.Control>
                        </Form.Group>


                        <Form.Group controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Button type="submit" variant="primary" className="mt-2">Update</Button>
                    </Form>
                )}
            </FormContainer>
        </div>
    )
}

export default ProductEditScreen
