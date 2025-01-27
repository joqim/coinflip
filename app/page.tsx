export default function Home() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Crypto Rates Challenge</h1>

      <div className="space-y-4">
        <section>
          <h2 className="text-xl font-semibold mb-2">Challenge Requirements:</h2>
          <ul className="list-disc pl-6">
            <li>Create a page that displays a list of cryptocurrency rates using the CoinCap API</li>
            <li>Each crypto should display: rank, name, symbol, and current price in USD</li>
            <li>Make each crypto clickable to navigate to a detail page</li>
            <li>On the detail page, implement a chart showing the price history</li>
            <li>Add basic error handling and loading states</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">API Information:</h2>
          <p>Base URL: https://api.coincap.io/v2</p>
          <ul className="list-disc pl-6">
            <li>Get all assets: GET /assets</li>
            <li>Get single asset: GET /assets/{'{id}'}</li>
            <li>Get asset history: GET /assets/{'{id}'}/history</li>
          </ul>
        </section>

        <div className="mt-6">
          <p className="text-gray-600">
            Start by implementing the assets list page at /assets
          </p>
        </div>

        {/* Button to navigate to /assets */}
        <div className="mt-6">
          <a href="/assets" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-200">
            Go to Assets List
          </a>
        </div>
      </div>
    </main>
  );
}
