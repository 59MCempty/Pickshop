import { Row, Col } from 'react-bootstrap'


import { useGetProductsQuery } from '../redux/slice/productApiSlice.js'
import Paginate from '../components/Paginate.jsx'
import Products from '../components/Products.jsx'
import Loader from '../components/Loader.jsx'
import Message from '../components/Message.jsx'
import { Link, useParams } from 'react-router-dom'
import ProductsCarousel from '../components/ProductsCarousel.jsx'



const HomeScreen = () => {

    const { pageNumber, keyword } = useParams();

    const { data, isLoading, error } = useGetProductsQuery({
        keyword,
        pageNumber,
    });


    return (
        <>
            {!keyword ? (
                <ProductsCarousel />
            ) : <Link to="/" className="btn btn-light mb-2" >Go Back</Link>}

            {isLoading ? (
                <Loader>
                </Loader>
            ) : error ? (
                <Message variant="danger">
                    {error?.data?.message || error?.error}
                </Message>
            ) : (
                <>
                    <h1>Latest Products</h1>
                    <Row>
                        {data.products.map((product) =>
                            <Col
                                key={product._id}
                                sm={12} md={6} lg={4} xl={3}>
                                <Products product={product} />
                            </Col>
                        )}
                    </Row>
                    <Paginate
                        page={data.page}
                        pages={data.pages}
                        keyword={keyword ? keyword : ''}
                    />
                </>
            )}
        </>
    )
}



export default HomeScreen
