// TODO: Implement the following API functions:
// - getAssets(): Fetches list of assets from /assets endpoint
// - getAsset(id): Fetches single asset from /assets/{id} endpoint
// - getAssetHistory(id): Fetches price history from /assets/{id}/history endpoint

export type Asset = {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  priceUsd: string;
  changePercent24Hr: string;
};

export type AssetsResponse = {
  data: Asset[];
  timestamp: number;
}; 