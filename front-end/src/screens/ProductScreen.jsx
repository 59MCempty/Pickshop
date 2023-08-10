import React, { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button, Form, FormGroup } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import Rating from '../components/Rating.jsx'
import { useCreateReviewProductMutation, useGetProductDetailsQuery } from '../redux/slice/productApiSlice.js'
import Message from '../components/Message.jsx'
import Loader from '../components/Loader.jsx'
import { addToCart } from '../redux/slice/cartSliceReducer.js'
import { toast } from 'react-toastify'
import Meta from '../components/Meta.jsx'

const ProductScreen = () => {
    const { id: productId } = useParams()

    // const product = products.find((p) => p._id === productId)
    const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId)
    const [qty, setQty] = useState(1)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [createReview, { isLoading: reviewLoading }] = useCreateReviewProductMutation()

    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const { userInfo } = useSelector((state) => state.auth)

    console.log(product)
    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty }))
        navigate('/cart')
    }

    const submitReviewHandler = async (e) => {

        e.preventDefault()
        const review = {
            productId,
            name: userInfo.name,
            rating,
            comment
        }
        try {
            await createReview(review).unwrap()
            toast.success('Review created')
            refetch()
        } catch (err) {
            toast.error(err?.data?.message || err.message)
        }
    }

    return (
        <>
            {isLoading ? (
                <Loader>
                </Loader>
            ) : error ? (
                <Message variant="danger">
                    {error?.data?.message || error?.error}
                </Message>
            ) : (
                <>
                    <Meta title={product.name} />
                    <Link className="btn btn-light my-3" to="/">Go Back</Link>
                    <Row>
                        <Col md={5}>
                            <Image src={product.image} alt={product.name} fluid />
                        </Col>

                        <Col md={4}>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h3>{product.name}</h3>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Rating rating={product.rating} review={product.numReviews} />
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Price: {product.price}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Description: {product.description}
                                </ListGroup.Item>

                            </ListGroup>
                        </Col>

                        <Col md={3}>
                            <Card>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Price:</Col>
                                            <Col>
                                                <strong>{product.price}</strong>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Status:</Col>
                                            <Col>
                                                <strong>{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</strong>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>

                                    {product.countInStock > 0 && (
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Qty</Col>
                                                <Col>
                                                    <Form.Control as="select" value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                                                        {[...Array(product.countInStock).keys()].map(x => (
                                                            <option key={x + 1} value={x + 1}>
                                                                {x + 1}
                                                            </option>
                                                        ))}

                                                    </Form.Control>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    )}
                                    <ListGroup.Item>
                                        <Button
                                            disabled={product.countInStock === 0}
                                            type="button"
                                            className="btn-block"
                                            onClick={addToCartHandler}>
                                            Add to Cart
                                        </Button>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>


                    <Row className="review mt-2">
                        <Col md={6}>
                            <h2>Reviews</h2>
                            {product.reviews.length === 0 && <Message>No Review</Message>}

                            <ListGroup variant="flush">

                                {product.reviews.map((review) =>
                                    <ListGroup.Item key={review._id}>
                                        <strong>{review.name}</strong>
                                        <Rating rating={review.rating} />
                                        <p>{review.createdAt.substring(0, 10)}</p>
                                        <p>{review.comment}</p>
                                    </ListGroup.Item>

                                )}

                                <h2>Customer Review</h2>
                                {reviewLoading && <Loader />}
                                {userInfo ? (
                                    <Form onSubmit={submitReviewHandler}>
                                        <FormGroup>
                                            <Form.Label>Rating</Form.Label>
                                            <Form.Control
                                                as="select"
                                                required
                                                value={rating}
                                                onChange={(e) => setRating(e.target.value)}
                                            >
                                                <option value="">Select...</option>
                                                <option value="1">1 - Poor</option>
                                                <option value="2">2 - Fair</option>
                                                <option value="3">3 - Good</option>
                                                <option value="4">4 - Very Good</option>
                                                <option value="5">5- Excellent</option>
                                            </Form.Control>
                                        </FormGroup>
                                        <FormGroup>
                                            <Form.Label>Comment</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                row="3"
                                                required
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                            ></Form.Control>
                                        </FormGroup>
                                        <Button type="submit" className="btn btn-primary">Submit</Button>
                                    </Form>

                                ) : (
                                    <Message>
                                        Please <Link to="/login">Login</Link> to write review
                                    </Message>
                                )}
                            </ListGroup>
                        </Col>


                    </Row>

                </>
            )}
        </>
    )
}

export default ProductScreen
