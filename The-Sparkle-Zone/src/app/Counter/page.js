import Counter from "../components/Counter";

export default function CounterPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-400 via-pink-300 to-blue-400 text-white">
      <h1 className="text-4xl font-bold mb-6">Clicker Game</h1>
      <Counter /> {/* The Counter component is included here */}
    </div>
  );
}
