export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white text-black">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl font-bold mb-4">Givn</h1>
        <p className="text-lg mb-6">Proof of Real Impact</p>

        <div className="border rounded-lg p-4 mb-6">
          <p className="font-semibold">✔ Verified Impact</p>
          <p>$500 donated in August</p>
          <p className="text-sm text-gray-500">Verified by Givn</p>
        </div>

        <button className="px-6 py-3 bg-black text-white rounded">
          Request access
        </button>
      </div>
    </main>
  );
}
