export default async function AssetPage({ params }: { params: { id: string } }) {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Asset Details</h1>
      <div className="p-4 border rounded-lg">
        {/* 
          TODO: Implement the following:
          1. Fetch asset data from /assets/{id} endpoint
          2. Display asset information:
             - Name
             - Price
             - Rank
             - Other relevant details
          3. Add loading state
          4. Add error handling
        */}
      </div>
    </main>
  );
}
