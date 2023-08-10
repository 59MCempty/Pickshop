import Product from '../../models/productModel.js'
import asyncHandler from '../../middleware/asyncHandler.js'


const getProducts = asyncHandler(async (req, res) => {

    const pageSize = process.env.PAGINATION_LIMIT
    const page = Number(req.query.pageNumber) || 1

    const keyword = req.query.keyword
        ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i'
            }
        }
        : {}

    const count = await Product.countDocuments({ ...keyword })
    const products = await Product.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1))

    res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
        res.json(product)
    } else {
        res.status(404)
        throw new Error('Resource not found')
    }
})
const createdProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        user: req.user._id,
        name: 'sample',
        image: '/images/sample.jpg',
        description: 'sample description',
        brand: 'sample',
        category: 'sample',
        price: 0,
        countInStock: 0,
        rating: 0,
        numReviews: 0
    })

    const createdProduct = await product.save()
    res.status(200).json(createdProduct)
})

const editProduct = asyncHandler(async (req, res) => {
    const { name, price, description, image, brand, category, countInStock } = req.body
    const product = await Product.findById(req.params.id)

    if (product) {
        product.name = name
        product.image = image
        product.price = price
        product.description = description
        product.brand = brand
        product.category = category
        product.countInStock = countInStock

        const updateProduct = await product.save()

        res.status(200).json(updateProduct)
    } else {
        res.status(404)
        throw new Error('Resources not found!')
    }

})

const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (product) {
        await Product.deleteOne({ _id: product._id })
        res.status(200).json('Deleted successfully!')
    } else {
        res.json(404)
        throw new Error('Resource not found')
    }

})

const createReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body

    const product = await Product.findById(req.params.id)

    if (product) {
        const alreadyReviewed = await product.reviews.find((review) =>
            review.user.toString() === req.user._id.toString()
        )
        if (alreadyReviewed) {
            res.status(400)
            throw new Error('Product already review')
        }
        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment
        }

        product.reviews.push(review)
        product.numReviews = product.reviews.length

        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

        await product.save()
        res.status(200).json({ message: 'Review added' })
    } else {
        res.status(400)

        throw new Error('Resource not found')
    }
})

const getTopProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3);

    res.json(products);
});


export { getProductById, getProducts, createdProduct, editProduct, deleteProduct, createReview, getTopProducts }
