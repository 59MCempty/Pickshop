import React from 'react'
import { Helmet } from 'react-helmet-async'

const Meta = ({title, description, keyword}) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keyword" content={keyword} />
        </Helmet>
    )
}

Meta.defaultProps = {
    title: "Welcome to Pickshop",
    description: "We sell the best products for cheap",
    keyword: "Electronic, by electronics, cheap electronics"
}

export default Meta
