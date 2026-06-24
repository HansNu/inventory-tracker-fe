import type { Asset }from './asset'

export interface AssetListResponse {
  data: Asset[];
  total: number;
}