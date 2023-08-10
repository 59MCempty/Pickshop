
import {FaStar, FaStarHalfAlt, FaRegStar} from "react-icons/fa"

const Rating = ({rating, review}) => {
    const starList = []
    const starsCount = Math.floor(rating)
    const hasHalfStar = rating - parseInt(rating) >= 0.5
    const emptyStar = 5 - starsCount - (hasHalfStar ? 1 : 0)

    for (let i = 0; i < starsCount; i ++) {
        starList.push(<FaStar />)
    }
    if (hasHalfStar) {
        starList.push(<FaStarHalfAlt />)
    }
    for (let i =0; i < emptyStar; i++) {
        starList.push(<FaRegStar />)
    }

    return (
        <div className="rating">
            <span>{starList}</span>
            <span className="rating-text">{review ? review + "reviews" : "" } </span>
        </div>
    )
}

export default Rating
