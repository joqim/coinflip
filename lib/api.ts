import useSWR from 'swr';
import { Asset, AssetsResponse, AssetHistoryResponse } from './types';

const BASE_URL = 'https://api.coincap.io/v2';

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
});

// SWR hooks
export function useAssets(limit: number = 12, offset: number = 0, searchTerm: string = '') {
  const searchQuery = searchTerm ? `&search=${searchTerm}` : '';
  const { data, error } = useSWR<AssetsResponse>(
    `${BASE_URL}/assets?limit=${limit}&offset=${offset}${searchQuery}`,
    fetcher
  );
  return {
    assets: data?.data || [],
    isLoading: !error && !data,
    isError: error,
  };
}

export function useAsset(id: string) {
  const { data, error } = useSWR<{ data: Asset }>(
    id ? `${BASE_URL}/assets/${id}` : null,
    fetcher
  );
  return {
    asset: data?.data || null,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useAssetHistory(id: string) {
  const { data, error } = useSWR<AssetHistoryResponse>(
    id ? `${BASE_URL}/assets/${id}/history?interval=d1` : null,
    fetcher
  );
  return {
    history: data?.data || [],
    isLoading: !error && !data,
    isError: error,
  };
}
