import { Tag, Popconfirm } from 'antd';

const ChangeFeatured = (props) => {
  const { featured } = props;
  return (
    <Popconfirm
      title="Xác nhận thay đổi đặc điểm?"
      description={`Bạn có muốn thay đổi đặc điểm sản phẩm này không?`}
      // onConfirm={handleConfirm}
      okText="Xác nhận"
      cancelText="Hủy"
    >
      <Tag
        color={featured ? "error" : "default"}
        style={{ cursor: 'pointer' }}
      >
        {featured ? "Nổi bật" : "Bình thường"}
      </Tag>
    </Popconfirm>
  );
};

export default ChangeFeatured;