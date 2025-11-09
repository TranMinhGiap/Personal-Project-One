import { Tag, Popconfirm } from 'antd';
import { useEffect, useState } from 'react';
import { CloseCircleOutlined, SmileOutlined } from '@ant-design/icons';
import { PATCH } from '../../../../utils/requests';

const ChangeFeatured = ({ id, featured, url, api }) => {
  const [currFeatured, setcurrFeatured] = useState(featured);
  const featuredUpdate = currFeatured ? false : true;

  useEffect(() => {
    setcurrFeatured(featured);
  }, [featured]);

  const handleConfirm = async () => {
    try {
      await PATCH(`/api/v1/admin/${url}/change-featured/${id}`, { featured : featuredUpdate } );
      api.open({
        message: 'Cập nhật trạng thái thành công',
        description: "Danh mục đã được cập nhật trạng thái",
        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight"
      });
      setcurrFeatured(featuredUpdate);
    } catch (error) {
      api.open({
        message: "Có lỗi khi cập nhật trạng thái danh mục! Vui lòng thử lại",
        description: error.message,
        showProgress: true,
        pauseOnHover: true,
        icon: <CloseCircleOutlined style={{ color: 'red' }} />,
        placement: "topRight"
      });
    }
  }
  return (
    <Popconfirm
      title="Xác nhận thay đổi đặc điểm?"
      description={`Bạn có muốn thay đổi đặc điểm sản phẩm này không?`}
      onConfirm={handleConfirm}
      okText="Xác nhận"
      cancelText="Hủy"
    >
      <Tag
        color={currFeatured ? "error" : "default"}
        style={{ cursor: 'pointer' }}
      >
        {currFeatured ? "Nổi bật" : "Bình thường"}
      </Tag>
    </Popconfirm>
  );
};

export default ChangeFeatured;