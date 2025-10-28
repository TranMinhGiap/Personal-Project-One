import { useEffect, useState } from 'react';
import { Button, Flex, Space, Table, message, Select, Badge, Dropdown, notification } from 'antd';
import { DownloadOutlined, PlusCircleOutlined, SmileOutlined } from '@ant-design/icons';
import { GET } from '../../../utils/requests';
import ActionTable from '../../components/common/ActionTable';
import { useNavigate, useLocation } from 'react-router-dom';
import useTableSearch from '../../../shared/helper/useTableSearch';
import ChangeStatusTable from '../../components/common/ChangeStatusTable';
import ChangeMulti from '../../components/common/ChangeMulti';

const RoleList = () => {

  //==========================================================

  //==========================================================

  const navigate = useNavigate();
  const location = useLocation();
  const [api, contextHolderNoti] = notification.useNotification();

  console.log("***");

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
  const [reload, setReload] = useState(true);
  const [filters, setFilters] = useState({ status: "all" });
  const [messageApi, contextHolder] = message.useMessage();

  const params = {
    ...filters,
    page: pagination.current,
    limit: pagination.pageSize,
  };

  const { getColumnSearchProps } = useTableSearch((value) => {
    setFilters(prev => ({
      ...prev,
      keyword: value 
    }));
    setPagination(prev => ({ ...prev, current: 1 })); 
  });

  const handleReload = () => {
    setSelectedRowKeys([]);
    setReload(!reload);
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (location.state?.success) {
        api.open({
          message: 'Thêm mới nhóm quyền thành công',
          description: "Đã thêm 1 danh mục mới",
          icon: <SmileOutlined style={{ color: '#108ee9' }} />,
          showProgress: true,
          pauseOnHover: true,
          placement: "topRight"
        });
        navigate(location.pathname, { replace: true });
      }
      try {
        const result = await GET("/api/v1/admin/roles", params);
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
  }, [pagination.current, pagination.pageSize, filters, reload]);

  console.log(params);

  const columns = [
    {
      title: 'Nhóm quyền',
      dataIndex: 'title',
      ...getColumnSearchProps('title', 'Tìm theo tên danh mục'),
      sorter: true,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      render: (_, record) => (
        <p>{record.description}</p>
      )
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status',
      render: (_, record) => (
        <ChangeStatusTable id={record["_id"]} status={record.status}/>
      )
    },
    {
      dataIndex: "action",
      width: 70,
      render: (_, record) => (
        <ActionTable id={record["_id"]} reload={handleReload} url={`product-category`} api={api} />
      )
    }
  ];
  
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

  const handleTableChange = (newPagination, _, newSorter) => {
    setPagination(newPagination);
    setFilters({
      ...filters,
      sortKey: newSorter.field,
      sortValue: newSorter.order === "ascend" ? "asc" : newSorter.order === "descend" ? "desc" : undefined
    })
  }

  const start = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 400);
  };
  const onSelectChange = newSelectedRowKeys => {
    // console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };
  const hasSelected = selectedRowKeys.length > 0;
  console.log("===");
  return (
    <>
      {contextHolder}
      {contextHolderNoti}
      <Flex gap="middle" vertical>
        <Flex align="center" justify='space-between'>
          <Space>
            <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading}>
              Reload
            </Button>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
          </Space>
          <Button 
            icon={<PlusCircleOutlined />} 
            color="primary" 
            variant="dashed"
            onClick={() => navigate('/admin/roles/create')}
          >
            Thêm nhóm quyền
          </Button>
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
              <ChangeMulti ids={selectedRowKeys} reload={handleReload} url="roles"/>
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
            scroll={{ y: 411 }}
          />
        </Flex>
      </Flex>
    </>
  );
};
export default RoleList;