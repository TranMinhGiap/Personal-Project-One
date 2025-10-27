import { Tag, notification, Popconfirm } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, SmileOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { PATCH } from '../../../../utils/requests';

const ChangeStatusTable = ({ id, status }) => {

  const [originalStatus, setOriginalStatus] = useState(status);
  const statusUpdate = originalStatus === "active" ? "inactive" : "active"
  const [api, contextHolderNoti] = notification.useNotification();
  // do state chi set initial value một lần khi mount 
  // parent re-render và truyền prop status mới (sau setData), state originalStatus không tự update theo prop => không cập nhật lại giá trị.
  useEffect(() => {
    setOriginalStatus(status);
  }, [status]);

  const handleConfirm = async () => {
    try {
      await PATCH(`/api/v1/admin/product-category/change-status/${id}`, { status : statusUpdate} );
      api.open({
        message: 'Cập nhật trạng thái thành công',
        description: "Danh mục sản phẩm đã được cập nhật trạng thái",
        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight"
      });
      setOriginalStatus(statusUpdate);
    } catch (error) {
      api.open({
        message: "Có lỗi khi cập nhật trạng thái danh mục sản phẩm! Vui lòng thử lại",
        description: error.message,
        showProgress: true,
        pauseOnHover: true,
        icon: <CloseCircleOutlined style={{ color: 'red' }} />,
        placement: "topRight"
      });
    }
  }

  return (
    <>
      {contextHolderNoti}
      {/* {status === "active" ? (
        <Tag icon={<CheckCircleOutlined />} color="success" onClick={() => handleClick("inactive")} style={{cursor: 'pointer'}}>
          Hoạt động
        </Tag>
      ) : (
        <Tag icon={<CloseCircleOutlined />} color="error" onClick={() => handleClick("active")} style={{cursor: 'pointer'}}>
          Dừng hoạt động
        </Tag>
      )} */}
      
      <Popconfirm
        title="Xác nhận thay đổi trạng thái?"
        description={`Bạn có muốn cập nhật trạng thái cho danh mục này không?`}
        onConfirm={handleConfirm}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <Tag
          icon={originalStatus === "active" ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={originalStatus === "active" ? "success" : "error"}
          // mặc định Popconfirm gán sự kiện click cho component con để hiển thị popup rồi. muốn tự khiển thì thêm open 
          // onClick={handleClick} 
          style={{ cursor: 'pointer' }}
        >
          {originalStatus === "active" ? "Hoạt động" : "Dừng hoạt động"}
        </Tag>
      </Popconfirm>
    </>
  );
};

export default ChangeStatusTable;