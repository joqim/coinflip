'use client';

import { useEffect, useState, useRef } from 'react';
import { useAssets } from '@/lib/api';
import Link from 'next/link';
import { GENERIC_ICON_URL, loadIcon } from '@/lib/utils';
import Image from 'next/image';
import { WEBSOCKET_URL, ASSETS_PER_PAGE, SEARCH_DELAY } from '@/lib/constants';

export default function AssetsList() {
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [iconUrls, setIconUrls] = useState<Record<string, string>>({});

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Using the useAssets hook
  const { assets, isLoading, isError } = useAssets(ASSETS_PER_PAGE, offset, debouncedSearchTerm);

  const [realTimePrices, setRealTimePrices] = useState<Record<string, string>>({});
  const [priceChanges, setPriceChanges] = useState<Record<string, number>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, SEARCH_DELAY);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setHasMore(true);
      setOffset(0);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    // Ensure assets are loaded on the initial render
    setHasMore(assets.length === ASSETS_PER_PAGE);
  }, [assets]);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isLoading]);

  // WebSocket for real-time price updates
  useEffect(() => {
    const ws = new WebSocket(`${WEBSOCKET_URL}?assets=ALL`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setRealTimePrices((prev) => {
        const updatedPrices = { ...prev, ...data };
        setPriceChanges((prevChanges) => {
          const updatedChanges: Record<string, number> = {};
          Object.keys(data).forEach((key) => {
            const newPrice = parseFloat(data[key]);
            const prevPrice = prev[key] ? parseFloat(prev[key]) : newPrice;
            updatedChanges[key] = newPrice - prevPrice;
          });
          return { ...prevChanges, ...updatedChanges };
        });
        return updatedPrices;
      });
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleNextPage = () => {
    if (!isLoading && hasMore) {
      setOffset((prevOffset) => prevOffset + ASSETS_PER_PAGE);
    }
  };

  const handlePrevPage = () => {
    if (!isLoading && offset > 0) {
      setOffset((prevOffset) => prevOffset - ASSETS_PER_PAGE);
    }
  };

  // Preload icon URLs for all assets
  useEffect(() => {
    const fetchIcons = async () => {
      const iconMap: Record<string, string> = {};
      for (const asset of assets) {
        iconMap[asset.symbol] = await loadIcon(asset.symbol);
      }
      setIconUrls(iconMap);
    };

    if (assets.length > 0) {
      fetchIcons();
    }
  }, [assets]);

  if (isError) return <p className="text-center text-red-500 text-lg">Failed to load assets.</p>;

  const SkeletonLoader = () => (
    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(ASSETS_PER_PAGE)].map((_, index) => (
        <div key={index} className="p-6 bg-white rounded-lg shadow-md animate-pulse">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <div className="ml-4 w-32 bg-gray-300 h-5"></div>
          </div>
          <p className="text-sm text-gray-500 mb-2 w-24 bg-gray-300 h-4"></p>
          <p className="text-2xl font-bold bg-gray-300 h-8"></p>
          <p className="text-sm bg-gray-300 h-4 w-24 mt-2"></p>
        </div>
      ))}
    </div>
  );

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8 font-sans">Crypto Assets</h1>

        <label htmlFor="searchInput" className="sr-only">
          Search assets
        </label>
        <input
          ref={searchInputRef}
          id="searchInput"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search assets"
          className="w-full p-2 mb-2 border border-gray-300 rounded-md"
          aria-describedby="searchInputDescription"
        />
        <p id="searchInputDescription" className="text-sm text-gray-500 mb-8">
          Type to search for assets by name or symbol.
        </p>

        {isLoading && assets.length === 0 ? (
          <SkeletonLoader />
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {assets.map((asset) => {
              const priceChange = priceChanges[asset.id] ?? 0;
              const priceChangeClass = priceChange > 0 ? 'text-green-500' : priceChange < 0 ? 'text-red-500' : 'text-gray-500';

              return (
                <Link key={asset.id} href={`/assets/${asset.id}`}>
                  <div
                    className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    aria-labelledby={`asset-name-${asset.id}`}
                  >
                    <div className="flex items-center mb-4">
                      {/* Using the preloaded icon URL */}
                      <Image
                        src={iconUrls[asset.symbol] || GENERIC_ICON_URL}
                        alt={`${asset.symbol} Icon`}
                        width={32}
                        height={32}
                        className="mr-4"
                      />
                      <div>
                        <h2
                          id={`asset-name-${asset.id}`}
                          className="text-xl font-semibold text-gray-800"
                        >
                          {asset.name}
                        </h2>
                        <p className="text-sm text-gray-500">Symbol: {asset.symbol}</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 mb-2">Rank: {asset.rank}</p>
                    <p className={`text-2xl font-bold ${priceChangeClass} transition-all duration-500`}>
                      ${realTimePrices[asset.id] || parseFloat(asset.priceUsd).toFixed(2)}
                    </p>
                    <p className={`text-sm ${priceChangeClass}`}>
                      {priceChange !== 0 ? `${priceChange > 0 ? '+' : ''}${priceChange.toFixed(2)}%` : 'No Change'}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrevPage}
            disabled={isLoading || offset === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-blue-300"
            aria-disabled={isLoading || offset === 0}
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={isLoading || !hasMore}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-blue-300"
            aria-disabled={isLoading || !hasMore}
          >
            Next
          </button>
        </div>

        {isLoading && <p className="text-center mt-4">Loading...</p>}
      </div>
    </main>
  );
}
