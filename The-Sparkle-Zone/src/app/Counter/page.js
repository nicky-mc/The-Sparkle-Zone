import Counter from "../components/Counter"; // Import the Counter component
export default function CounterPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-400 via-pink-300 to-blue-400 text-white">
      <Counter /> {/* The Counter component is included here */}
    </div>
  );
}
