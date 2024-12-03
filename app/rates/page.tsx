import Link from 'next/link';

export default async function RatesPage() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Crypto Rates</h1>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* 
          TODO: Implement the following:
          1. Fetch data from /assets endpoint
          2. Display crypto cards with:
             - Name
             - Rank
             - Current price
          3. Make cards clickable (link to detail page)
          4. Add loading state
          5. Add error handling
        */}
      </div>
    </main>
  );
}
