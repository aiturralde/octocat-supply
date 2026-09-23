import { useRef } from 'react';

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
  const starRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, star: number) => {
    const moves: Record<string, number> = {
      ArrowRight: star === STARS.length ? 1 : star + 1,
      ArrowDown: star === STARS.length ? 1 : star + 1,
      ArrowLeft: star === 1 ? STARS.length : star - 1,
      ArrowUp: star === 1 ? STARS.length : star - 1,
      Home: 1,
      End: STARS.length,
    };
    if (!(event.key in moves)) {
      return;
    }

    const next = moves[event.key];
    event.preventDefault();
    onRate(next);
    starRefs.current[next]?.focus();
  };

  return (
    <div className="flex items-center justify-between">
      <div
        className="flex items-center gap-1"
        role="radiogroup"
        aria-label={`Star review for ${productName}`}
        id={`star-rating-${productId}`}
      >
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
              ref={(element) => {
                starRefs.current[star] = element;
              }}
              tabIndex={star === rating || (rating === 0 && star === 1) ? 0 : -1}
              onClick={() => onRate(star)}
              onKeyDown={(event) => handleKeyDown(event, star)}
              className={`w-11 h-11 flex items-center justify-center rounded-full text-3xl leading-none transform transition-all duration-200 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                darkMode ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'
              } ${
                isSelected
                  ? 'text-red-600 motion-safe:animate-pulse drop-shadow-[0_0_10px_rgba(220,38,38,0.9)]'
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
        id={`star-rating-value-${productId}`}
        data-testid="star-rating-value"
      >
        {rating > 0 ? `${rating} of 5` : 'Rate it'}
      </span>
    </div>
  );
}
