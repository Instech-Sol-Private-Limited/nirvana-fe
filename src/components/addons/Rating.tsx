import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";

interface RatingProps {
  rating: number;
  totalReviews?: number;
  size?: number;
}

const Rating: React.FC<RatingProps> = ({
  rating,
  totalReviews,
  size,
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {[...Array(fullStars)].map((_, index) => (
        <IoIosStar
          key={index}
          className="text-yellow-400 fill-yellow-400"
          size={size ? size : 20}
        />
      ))}
      {hasHalfStar && (
        <IoIosStarHalf
          className="text-yellow-400 fill-yellow-400"
          size={size ? size : 20}
        />
      )}
      {[...Array(emptyStars)].map((_, index) => (
        <IoIosStarOutline
          key={index}
          className="text-gray-300 stroke-gray-400"
          size={size ? size : 20}
        />
      ))}

      {totalReviews !== undefined && (
        <span className="text-sm text-gray-500 ml-2 mt-1">
          {totalReviews} Reviews
        </span>
      )}
    </div>
  );
};

export default Rating;
