export interface AssetParams {
  page: number;
  pageSize: number;
  search: string;
  type: string;
  status: string;
  sortField: string;
  sortOrder: "ascend" | "descend" | "";
}