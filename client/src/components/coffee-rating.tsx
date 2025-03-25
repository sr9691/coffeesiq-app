export default function CoffeeRating({ rating }: { rating: number }) {
  // Ensure rating is between 0 and 5
  const validRating = Math.min(5, Math.max(0, rating));
  
  // Calculate width percentage based on rating
  const widthPercentage = (validRating / 5) * 100;
  
  return (
    <div className="inline-block relative text-2xl">
      <div className="text-coffee-cream">
        <CoffeeBean />
        <CoffeeBean />
        <CoffeeBean />
        <CoffeeBean />
        <CoffeeBean />
      </div>
      <div 
        className="absolute top-0 left-0 text-coffee-brown overflow-hidden whitespace-nowrap"
        style={{ width: `${widthPercentage}%` }}
      >
        <CoffeeBean />
        <CoffeeBean />
        <CoffeeBean />
        <CoffeeBean />
        <CoffeeBean />
      </div>
    </div>
  );
}

function CoffeeBean() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="inline-block w-5 h-5" aria-hidden="true">
      <ellipse cx="12" cy="12" rx="7" ry="5" transform="rotate(45 12 12)" />
      <ellipse cx="12" cy="12" rx="3.5" ry="2" transform="rotate(45 12 12)" fill="none" stroke="currentColor" strokeWidth="0.7" />
    </svg>
  );
}
