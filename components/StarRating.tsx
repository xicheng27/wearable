interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

export default function StarRating({
  rating,
  max = 5,
  size = "md",
  showValue = false,
}: StarRatingProps) {
  const sizeClass = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }[size];

  return (
    <span
      className="inline-flex items-center gap-0.5"
      aria-label={`${rating} out of ${max} stars`}
      role="img"
    >
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <svg
            key={i}
            className={`${sizeClass} flex-shrink-0`}
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={`half-${i}`}>
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#D1D5DB" />
              </linearGradient>
            </defs>
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              fill={
                filled
                  ? "#F59E0B"
                  : half
                  ? `url(#half-${i})`
                  : "#D1D5DB"
              }
            />
          </svg>
        );
      })}
      {showValue && (
        <span className="ml-1 text-sm font-semibold text-gray-700">{rating.toFixed(1)}</span>
      )}
    </span>
  );
}
