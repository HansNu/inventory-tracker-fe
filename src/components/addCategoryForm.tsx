import React, { useEffect, useState } from "react";
import {
    Table,
    Input,
    Select,
    Button,
    Typography,
    Row,
    Col,
    Card,
    Space,
    Popconfirm,
    message,
    Divider,
} from "antd";
import {
    SearchOutlined,
    ReloadOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

import { apiConstants, navConstants } from "../constants";
import type { CategoryRow } from "../models/modelIndex";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Option } = Select;

async function getAssetCategoryList(): Promise<CategoryRow[]> {
    const res = await axios.get<any[]>(apiConstants.getAssetCategoryList);
    return res.data.map((x: any) => ({
        ...x,
        key: crypto.randomUUID(),
    }));
}
const CategoryListPage: React.FC = () => {
    const [categories, setCategories] = useState<CategoryRow[]>([]);
    const [loading, setLoading] = useState(false);

    const [searchInput, setSearchInput] = useState("");
    const [filterGroup, setFilterGroup] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        setLoading(true);

        try {
            const data = await getAssetCategoryList();
            setCategories(data);
        } catch {
            message.error("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    const handleAddRow = () => {
        setCategories(prev => [
            ...prev,
            {
                id: -Date.now(),      // temporary unique id
                categoryName: "",
                categoryGroup: "",
                isNew: true,
            },
        ]);
    };

    const updateRow = (
        id: number,
        field: "categoryName" | "categoryGroup",
        value: string
    ) => {
        setCategories(prev =>
            prev.map(row =>
                row.id === id
                    ? { ...row, [field]: value }
                    : row
            )
        );
    };

    const saveRow = async (row: CategoryRow) => {
        if (!row.categoryName || !row.categoryGroup) {
            message.warning("Please complete both fields.");
            return;
        }

        await axios.post(apiConstants.addAssetCategory, row)

        message.success("Category added.");

        setCategories(prev =>
            prev.map(r =>
                r.id === row.id
                    ? { ...r, isNew: false }
                    : r
            )
        );
    };

    const cancelRow = (id: number) => {
        setCategories(prev =>
            prev.filter(row => row.id !== id)
        );
    };

    const deleteCategory = (id: number) => {
        axios.delete(apiConstants.deleteAssetCategoryById, { data: { id: id } });
        setCategories((prev) => prev.filter((x) => x.id !== id));

        message.success("Deleted");
    };

    const filtered = categories.filter((x) => {
        const matchesSearch =
            x.categoryName.toLowerCase().includes(searchInput.toLowerCase()) ||
            x.categoryGroup.toLowerCase().includes(searchInput.toLowerCase());

        const matchesGroup = !filterGroup || x.categoryGroup === filterGroup || x.isNew;

        return matchesSearch && matchesGroup;
    });

    const columns: ColumnsType<CategoryRow> = [
        {
            title: "Category Name",
            dataIndex: "category_name",
            render: (_, record) =>
                record.isNew ? (
                    <Input
                        value={record.categoryName}
                        onChange={(e) =>
                            updateRow(
                                record.id,
                                "categoryName",
                                e.target.value
                            )
                        }
                    />
                ) : (
                    record.categoryName
                ),
        },
        {
            title: "Category Group",
            dataIndex: "category_group",
            render: (_, record) =>
                record.isNew ? (
                    <Input
                        value={record.categoryGroup}
                        onChange={(e) =>
                            updateRow(
                                record.id,
                                "categoryGroup",
                                e.target.value
                            )
                        }
                    />
                ) : (
                    record.categoryGroup
                ),
        },
        {
            title: "Action",
            width: 180,
            render: (_, record) =>
                record.isNew ? (
                    <Space>
                        <Button
                            type="link"
                            onClick={() => saveRow(record)}
                        >
                            Save
                        </Button>

                        <Button
                            type="link"
                            danger
                            onClick={() => cancelRow(record.id)}
                        >
                            Cancel
                        </Button>
                    </Space>
                ) : (
                    <Popconfirm
                        title="Delete category?"
                        onConfirm={() => deleteCategory(record.id)}
                    >
                        <Button danger type="link">
                            Delete
                        </Button>
                    </Popconfirm>
                ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Row justify="space-between" style={{ marginBottom: 20 }}>
                <Col>
                    <Title level={4}>Asset Categories</Title>
                </Col>
            </Row>

            <Card style={{ marginBottom: 16 }}>
                <Row gutter={12}>
                    <Col span={8}>
                        <Input
                            allowClear
                            value={searchInput}
                            prefix={<SearchOutlined />}
                            placeholder="Search..."
                            onChange={(e) =>
                                setSearchInput(e.target.value)
                            }
                        />
                    </Col>

                    <Col span={6}>
                        <Select
                            allowClear
                            style={{ width: "100%" }}
                            placeholder="Category Group"
                            value={filterGroup || undefined}
                            onChange={(v) => setFilterGroup(v ?? "")}
                            // dropdownRender lets you inject arbitrary content below the
                            // option list — same idea as a "footer slot" in a component library
                            dropdownRender={(menu) => (
                                <>
                                    {menu}
                                    <Divider style={{ margin: "8px 0" }} />
                                    <Button
                                        type="text"
                                        block
                                        icon={<PlusOutlined />}
                                        // onMouseDown instead of onClick: Select closes the dropdown
                                        // on blur before a click event fires, so onClick would get
                                        // swallowed. onMouseDown fires first, before blur.
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => navigate(navConstants.addCatGroupForm)}
                                    >
                                        Add Category Group
                                    </Button>
                                </>
                            )}
                        >
                            {[
                                ...new Set(
                                    categories.map((x) => x.categoryGroup)
                                ),
                            ].map((group) => (
                                <Option key={group} value={group}>
                                    {group}
                                </Option>
                            ))}
                        </Select>
                    </Col>

                    <Col>
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={() => {
                                setSearchInput("");
                                setFilterGroup("");
                            }}
                        >
                            Reset
                        </Button>
                    </Col>
                </Row>
            </Card>

            <Table<CategoryRow>
                rowKey="id"
                columns={columns}
                dataSource={filtered}
                loading={loading}
                pagination={{
                    pageSize: 10,
                }}
            />

            <div style={{ marginTop: 16 }}>
                <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={handleAddRow}
                >
                    Add Row
                </Button>
            </div>
        </div>
    );
};

export default CategoryListPage;