interface StarRatingProps {
  productId: number;
  productName: string;
  rating: number;
  onRate: (rating: number) => void;
  darkMode: boolean;
}

const STARS = [1, 2, 3, 4, 5];

export default function StarRating({
  productId,
  productName,
  rating,
  onRate,
  darkMode,
}: StarRatingProps) {
  return (
    <div
      className="flex items-center justify-between"
      role="radiogroup"
      aria-label={`Star review for ${productName}`}
      id={`star-rating-${productId}`}
    >
      <div className="flex items-center gap-1">
        {STARS.map((star) => {
          const isSelected = star <= rating;
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={star === rating}
              aria-label={`Rate ${productName} ${star} ${star === 1 ? 'star' : 'stars'}`}
              id={`rate-${productId}-${star}`}
              onClick={() => onRate(star)}
              className={`w-11 h-11 flex items-center justify-center rounded-full text-3xl leading-none transform transition-all duration-200 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                darkMode ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'
              } ${
                isSelected
                  ? 'text-red-600 animate-pulse drop-shadow-[0_0_10px_rgba(220,38,38,0.9)]'
                  : `${darkMode ? 'text-gray-600' : 'text-gray-300'} hover:text-red-400`
              }`}
            >
              <span aria-hidden="true">★</span>
            </button>
          );
        })}
      </div>
      <span
        className={`text-sm whitespace-nowrap ${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}
        aria-live="polite"
        id={`star-rating-value-${productId}`}
      >
        {rating > 0 ? `${rating} of 5` : 'Rate it'}
      </span>
    </div>
  );
}
