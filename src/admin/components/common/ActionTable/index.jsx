import { Button, Dropdown } from 'antd';
import { MoreOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const ActionTable = (props) => {
  const { record, url } = props;

  const items = [
    {
      key: 'view',
      label: (
        <Button color="primary" variant="filled" icon={<EyeOutlined />}></Button>
      ),
      onClick: () => {
        // Logic xem chi tiết (ví dụ: navigate(`/detail/${record._id}`))
        console.log('View:', record._id);
      },
    },
    {
      key: 'edit',
      label: (
        <Button color="purple" variant="filled" icon={<EditOutlined />}></Button>
      ),
      onClick: () => {
        // Logic sửa (ví dụ: mở modal edit)
        console.log('Edit:', record._id);
      },
    },
    {
      key: 'delete',
      label: (
        <Button color="danger" variant="filled" icon={<DeleteOutlined />}></Button>
      ),
      onClick: () => {
        // Logic xóa (ví dụ: confirm rồi API delete)
        console.log('Delete:', record._id);
      },
    },
  ]

  return (
    <>
      <Dropdown
        menu={{items}}
        // trigger={['click']}
        placement="bottomRight"
        overlayClassName="actions-dropdown"  // Để custom style nếu cần
      >
        <Button type="text" icon={<MoreOutlined />} size="small" className="flex items-center justify-center" />
      </Dropdown>
    </>
  );
};

export default ActionTable;