export type Asset = {
  icon: any;
  id: string;
  rank: string;
  symbol: string;
  name: string;
  priceUsd: string;
  changePercent24Hr: string;
  explorer: string;
};

export type AssetsResponse = {
  data: Asset[];
  timestamp: number;
};

export type AssetHistory = {
  priceUsd: string;
  time: number;
};

export type AssetHistoryResponse = {
  data: AssetHistory[];
  timestamp: number;
};

export type WebSocketMessageHandler = (data: Record<string, string>) => void;
