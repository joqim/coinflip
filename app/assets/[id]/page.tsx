'use client';

import { useParams } from 'next/navigation';
import { useAsset, useAssetHistory } from '@/lib/api';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { createWebSocket } from '@/lib/websocket';
import '@/lib/chart';
import Link from 'next/link';
import { formatDate, loadIcon } from '@/lib/utils';
import Image from 'next/image';
import { WEBSOCKET_URL } from '@/lib/constants';

const Chart = dynamic(() => import('react-chartjs-2').then((mod) => mod.Chart), { ssr: false });

export default function AssetDetail() {
  const { id } = useParams();
  const assetId = Array.isArray(id) ? id[0] : id;

  // Ensure assetId is a valid string
  if (!assetId) {
    return <p className="text-center mt-4" role="alert">Asset ID is missing.</p>;
  }

  // Fetch asset and asset history data using SWR hooks
  const { asset, isLoading: assetLoading, isError: assetError } = useAsset(assetId);
  const { history, isLoading: historyLoading, isError: historyError } = useAssetHistory(assetId);

  const [realTimePrice, setRealTimePrice] = useState<string | null>(null);
  const [iconUrl, setIconUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!asset || assetError) return;

    const loadIconUrl = async () => {
      const icon = await loadIcon(asset.symbol);
      setIconUrl(icon);
    };

    loadIconUrl();
    const ws = createWebSocket(`${WEBSOCKET_URL}?assets=${assetId}`, (data) => {
      if (data[assetId]) {
        setRealTimePrice(data[assetId]);
      }
    });

    return () => {
      ws.close();
    };
  }, [asset, assetId, assetError]);

  // Handle loading and error states
  if (assetLoading || historyLoading) return <p className="text-center mt-4" role="status">Loading...</p>;
  if (assetError || historyError) return <p className="text-center text-red-500 mt-4" role="alert">Failed to load asset details.</p>;
  if (!asset) return <p className="text-center mt-4" role="alert">Asset not found.</p>;

  const chartData = {
    labels: history.map((point) => formatDate(point.time)),
    datasets: [
      {
        label: 'Price (USD)',
        data: history.map((point) => parseFloat(point.priceUsd)),
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        type: 'category' as const,
        ticks: {
          autoSkip: true,
          maxRotation: 45,
          minRotation: 0,
          font: {
            size: 12,
          },
        },
      },
      y: {
        type: 'linear' as const,
        ticks: {
          font: {
            size: 12,
          },
          callback: (value: string | number) => (typeof value === 'number' ? `$${value}` : value),
        },
      },
    },
  };

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <Link href="/assets">
          <button
            className="inline-flex items-center px-4 py-2 mb-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Back to Assets List"
          >
            &larr; Back to Assets List
          </button>
        </Link>

        <h1 className="text-3xl font-semibold text-gray-800 mt-24 mb-6 font-sans flex items-center">
          {asset.name}
          {iconUrl && (
            <Image
              src={iconUrl}
              alt={`${asset.name} icon`}
              width={32}
              height={32}
              className="ml-4"
              role="img"
              aria-label={`${asset.name} icon`}
            />
          )}
        </h1>

        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Details</h2>
            <ul className="space-y-2 text-gray-600">
              <li><strong>Rank:</strong> {asset.rank}</li>
              <li><strong>Symbol:</strong> {asset.symbol}</li>
              <li>
                <strong>Price:</strong> ${realTimePrice || parseFloat(asset.priceUsd).toFixed(2)}
              </li>
              <li>
                <strong>24h Change:</strong>{' '}
                <span
                  className={parseFloat(asset.changePercent24Hr) >= 0 ? 'text-green-600' : 'text-red-600'}
                  aria-live="polite"
                >
                  {parseFloat(asset.changePercent24Hr).toFixed(2)}%
                </span>
              </li>
            </ul>
          </div>

          <div className="col-span-2 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Price History</h2>
            <div className="h-64" aria-live="polite">
              <Chart type="line" data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
