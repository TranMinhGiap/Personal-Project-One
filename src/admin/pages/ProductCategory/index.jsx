import { useEffect, useState } from 'react';
import { Button, Flex, Space, Table, message, Select, Badge, Input, Dropdown } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { GET } from '../../../utils/requests';

//==========================================================
const { Search } = Input;

const columns = [
  { title: 'Tên danh mục', dataIndex: 'title' },
  { title: 'Trạng thái', dataIndex: 'status' },
  { title: 'Vị trí', dataIndex: 'position' },
];

//=========================================================

const ProductCategory = () => {

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: [ 8, 15, 25, 35],
    showQuickJumper: true
  });
  const [filters, setFilters] = useState({ status: "all" });
  const [messageApi, contextHolder] = message.useMessage();

  const params = {
    ...filters,
    page: pagination.current,
    limit: pagination.pageSize,
  };

  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);
      try {
        const result = await GET("/api/v1/admin/product-category", params);
        console.log(result);
        setData(result.data);
        setPagination(prev => ({
          ...prev,
          total: result.pagination?.totalPage * result.pagination?.limit || 0,
        }));
      } catch (error) {
        messageApi.open({
          type: 'error',
          content: error.message
        });
        setData([]);  // Reset data nếu lỗi
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [pagination.current, pagination.pageSize, filters]);

  console.log(params);
  
  const exportMenuItems = [
    {
      key: 'print',
      label: 'Print',
      onClick: () => {
        // Logic cho Print (ví dụ: window.print())
        console.log('Print clicked');
      },
    },
    {
      key: 'csv',
      label: 'Download as CSV',
      onClick: () => {
        // Logic cho Download CSV (ví dụ: fetch API export)
        console.log('Download CSV clicked');
      },
    },
  ];

  const handleTableChange = (newPagination, filters, sorter) => {
    console.log(newPagination);
    setPagination(newPagination);
  }

  const start = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 400);
  };
  const onSelectChange = newSelectedRowKeys => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };
  const hasSelected = selectedRowKeys.length > 0;
  return (
    <>
      {contextHolder}
      <Flex gap="middle" vertical>
        <Flex align="center" gap="middle">
          <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading}>
            Reload
          </Button>
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
        </Flex>
        <Flex vertical>
          <Flex justify='space-between' style={{padding: '16px 8px', backgroundColor: "white", borderRadius: "12px 12px 0 0"}}>
            <Space>
              <Select
                defaultValue="all"
                style={{ width: 170 }}
                onChange={(v) => setFilters({...filters, status: v})}
                options={[
                  { value: 'all', label: <Badge status="default" text="Tất cả" /> },
                  { value: 'active', label: <Badge status="success" text="Hoạt động" /> },
                  { value: 'inactive', label: <Badge status="error" text="Dừng hoạt động" /> }
                ]}
                disabled={loading}
              />
              <Search
                style={{width: 300}}
                placeholder="Nhập tên sản phẩm"
                loading={loading}
                disabled={loading}
                onSearch={(v) => setFilters({ ...filters, keyword: v })}
              />
            </Space>
            <Space>
              <Dropdown
                menu={{ items: exportMenuItems }}
                placement="bottomRight"
                trigger={["click"]}
                arrow
              >
                <Button color="purple" variant="outlined" icon={<DownloadOutlined />}>
                  Export
                </Button>
              </Dropdown>
            </Space>
          </Flex>
          <Table
            rowSelection={rowSelection}
            loading={loading}
            columns={columns}
            dataSource={data}
            rowKey="_id"
            pagination={pagination}
            onChange={handleTableChange}
            scroll={{ y: 400 }}
          />
        </Flex>
      </Flex>
    </>
  );
};
export default ProductCategory;