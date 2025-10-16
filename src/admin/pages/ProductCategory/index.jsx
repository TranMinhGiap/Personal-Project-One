import { useEffect, useState } from 'react';
import { Button, Flex, Table, message } from 'antd';
import { GET } from '../../../utils/requests';

const columns = [
  { title: 'Tên danh mục', dataIndex: 'title' },
  { title: 'Trạng thái', dataIndex: 'status' },
  { title: 'Vị trí', dataIndex: 'position' },
];

const ProductCategory = () => {

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0
  });
  const params = {
    page: pagination.current,
    limit: pagination.pageSize,
  };
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
  }, [pagination.current, pagination.pageSize]);

  console.log(pagination);

  const handleTablePagination = (newPagination) => {
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
        <Table 
          rowSelection={rowSelection} 
          loading={loading}   
          columns={columns} 
          dataSource={data} 
          rowKey="_id" 
          pagination={pagination}
          onChange={handleTablePagination}
          scroll={{ y: 300 }}
        />
      </Flex>
    </>
  );
};
export default ProductCategory;