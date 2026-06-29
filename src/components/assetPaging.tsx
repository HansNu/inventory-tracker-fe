import React, { useState, useEffect, useCallback } from 'react'
import {
  Table,
  Input,
  Select,
  Button,
  Space,
  Tag,
  Typography,
  Row,
  Col,
  Card,
  Tooltip,
  Popconfirm,
  message,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import { useNavigate } from "react-router-dom";
import { apiConstants, navConstants } from "../constants"
import type { Asset, AssetParams, AssetListResponse, AssetCategory } from '../models/modelIndex';

const { Title } = Typography;
const { Option } = Select;

// ─── API (swap these for your real endpoints) ────────────────────────────────
const STATUS_OPTIONS: Asset["status"][] = ["Active", "Inactive", "Maintenance"];

async function getAssetCategoryList(): Promise<AssetCategory[]>{
  const res = await fetch(`${apiConstants.getAssetCategoryList}`)
  if(!res.ok) throw new Error("Failed to fetch Asset Category");
  
  return res.json();
}

async function getAssetList(params: AssetParams): Promise<AssetListResponse> {
  const query = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
    ...(params.search && { search: params.search }),
    ...(params.type && { type: params.type }),
    ...(params.status && { status: params.status }),
    ...(params.sortField && { sortField: params.sortField }),
    ...(params.sortOrder && { sortOrder: params.sortOrder }),
  });

  const res = await fetch(`${apiConstants.getAssetList}?${query}`);
  if (!res.ok) throw new Error("Failed to fetch assets");
  return res.json();
}

async function deleteAsset(id: number): Promise<void> {
  const res = await fetch(`/api/assets/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete asset");
}

// ─── Status badge helper ─────────────────────────────────────────────────────

const STATUS_COLORS: Record<Asset["status"], string> = {
  Active: "green",
  Inactive: "default",
  Maintenance: "orange",
};

// ─── Component ───────────────────────────────────────────────────────────────

const AssetListPage: React.FC = () => {
  const navigate = useNavigate();

  const [assets, setAssets] = useState<Asset[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Filter / search / pagination state
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState(""); // controlled input, debounced into `search`
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });
  const [sortField, setSortField] = useState("purchase_date");
  const [sortOrder, setSortOrder] = useState<"ascend" | "descend" | "">("descend");
  const [categoryDdl, setCategoryDdl] = useState<AssetCategory[]>([]);

  // ── Debounce search input ──────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPagination((p) => ({ ...p, current: 1 }));
    }, 400);
    return () => clearTimeout(t);
    
  }, [searchInput]);

  useEffect(() => {
    getAssetCategoryList().then((data) =>setCategoryDdl(data))
    .catch(()=> message.error("Failet to load categories"));
  }, [])

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAssetList({
        page: pagination.current ?? 1,
        pageSize: pagination.pageSize ?? 10,
        search,
        type: filterType,
        status: filterStatus,
        sortField,
        sortOrder,
      });
      setAssets(result.data);
      setTotal(result.total);
    } catch {
      message.error("Could not load assets. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, search, filterType, filterStatus, sortField, sortOrder]);

  useEffect(() => {
    load();
  }, [load]);

  // ── Table change handler (pagination + sort) ───────────────────────────────
  const handleTableChange = (
    newPagination: TablePaginationConfig,
    _filters: Record<string, FilterValue | null>,
    sorter: SorterResult<Asset> | SorterResult<Asset>[]
  ) => {
    setPagination(newPagination);

    const s = Array.isArray(sorter) ? sorter[0] : sorter;
    setSortField(s.field as string ?? "PurchaseDate");
    setSortOrder((s.order as "ascend" | "descend") ?? "");
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    try {
      await deleteAsset(id);
      message.success("Asset deleted");
      load();
    } catch {
      message.error("Delete failed. Please try again.");
    }
  };

  // ── Reset filters ──────────────────────────────────────────────────────────
  const handleReset = () => {
    setSearchInput("");
    setSearch("");
    setFilterType("");
    setFilterStatus("");
    setPagination({ current: 1, pageSize: 10 });
    setSortField("purchase_date");
    setSortOrder("descend");
  };

  // ── Columns ────────────────────────────────────────────────────────────────
  const columns: ColumnsType<Asset> = [
    {
      title: "Asset Code",
      dataIndex: "asset_code",
      key: "assetCode",
      sorter: true,
      ellipsis: true,
    },
    {
      title: "Name",
      dataIndex: "asset_name",
      key: "assetName",
      sorter: true,
      ellipsis: true,
    },
    {
      title: "Asset Category",
      dataIndex: "asset_category",
      key: "assetCategory",
      sorter: true,
      ellipsis: true,
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      sorter: true,
      width: 130,
    },
    {
      title: "Serial Number",
      dataIndex: "serial_number",
      key: "serialNumber",
      sorter: true,
      width: 130,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status: Asset["status"]) => (
        <Tag color={STATUS_COLORS[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Tag>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      ellipsis: true,
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      ellipsis: true,
      render: (v?: string) => v ?? <span style={{ color: "#bbb" }}>—</span>,
    },
    {
      title: "Purchase Date",
      dataIndex: "purchase_date",
      key: "purchaseDate",
      sorter: true,
      width: 130,
      render: (v: string) =>
        new Date(v).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      fixed: "right",
      render: (_: unknown, record: Asset) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/assets/${record.id}/edit`)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete this asset?"
              description="This action cannot be undone."
              onConfirm={() => handleDelete(record.id)}
              okText="Delete"
              okButtonProps={{ danger: true }}
              cancelText="Cancel"
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: "24px" }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>
            Assets
          </Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate(navConstants.addAssetForm)}
          >
            Add Asset
          </Button>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 16 }} styles={{ body: { padding: "16px 20px" } }}>
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={24} md={8} lg={8}>
            <Input
              placeholder="Search by name or location…"
              prefix={<SearchOutlined style={{ color: "#bbb" }} />}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              allowClear
            />
          </Col>

          <Col xs={12} sm={8} md={5} lg={4}>
            <Select
              placeholder="Type"
              style={{ width: "100%" }}
              value={filterType || undefined}
              onChange={(v) => {
                setFilterType(v ?? "");
                setPagination((p) => ({ ...p, current: 1 }));
              }}
              allowClear
            >
              {categoryDdl.map((t) => (
                <Option key={t.category_name} value={t.category_name}>
                  {t.category_name}
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={12} sm={8} md={5} lg={4}>
            <Select
              placeholder="Status"
              style={{ width: "100%" }}
              value={filterStatus || undefined}
              onChange={(v) => {
                setFilterStatus(v ?? "");
                setPagination((p) => ({ ...p, current: 1 }));
              }}
              allowClear
            >
              {STATUS_OPTIONS.map((s) => (
                <Option key={s} value={s}>
                  <Tag color={STATUS_COLORS[s]} style={{ margin: 0 }}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </Tag>
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={8} md={6} lg={8}>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              Reset
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Table<Asset>
        rowKey="id"
        columns={columns}
        dataSource={assets}
        loading={loading}
        scroll={{ x: 900 }}
        onChange={handleTableChange}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (tot, range) => `${range[0]}–${range[1]} of ${tot} assets`,
        }}
      />
    </div>
  );
};

export default AssetListPage;