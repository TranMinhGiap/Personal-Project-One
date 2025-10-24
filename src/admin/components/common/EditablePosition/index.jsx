import { InputNumber, Popconfirm, notification } from "antd";
import { useState } from "react";
import { SmileOutlined, CloseCircleFilled } from '@ant-design/icons';
import { PATCH } from "../../../../utils/requests";

const EditablePosition = ({ value: initialValue, categorytId }) => {
  const [value, setValue] = useState(initialValue);
  const [originalValue, setOriginalValue] = useState(initialValue);
  const [showConfirm, setShowConfirm] = useState(false);
  const [api, contextHolderNoti] = notification.useNotification();

  const handleBlur = () => {
    // Nếu không có thay đổi so với vị trí ban đầu, không làm gì
    if (value === originalValue) return;
    // Ngược lại hiển thị Popconfirm khi có thay đổi
    setShowConfirm(true);
  };

  const handleCancel = () => {
    setValue(originalValue); // rollback về giá trị cũ
    setShowConfirm(false);
  };

  const handleConfirm = async () => {
    try {
      await PATCH(`/api/v1/admin/product-category/change-position/${categorytId}`, { position : value} )
      api.open({
        message: 'Thay đổi vị trí thành công',
        description: "Danh mục sản phẩm đã được thay đổi vị trí",
        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight"
      });
      setOriginalValue(value);
    } catch (error) {
      api.open({
        message: "Có lỗi khi thay đổi vị trí danh mục sản phẩm! Vui lòng thử lại",
        description: error.message,
        showProgress: true,
        pauseOnHover: true,
        icon: <CloseCircleFilled style={{ color: '#108ee9' }} />,
        placement: "topRight"
      });
      setValue(originalValue); // rollback nếu lỗi
    } finally {
      setShowConfirm(false);
    }
  };
  return (
    <>
      {contextHolderNoti}
      <Popconfirm
        title="Xác nhận thay đổi vị trí?"
        description={`Bạn có muốn cập nhật vị trí từ ${originalValue} → ${value}?`}
        open={showConfirm}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <InputNumber
          value={value}
          onChange={(v) => setValue(v)}
          onBlur={handleBlur}
          style={{ width: 70 }}
          onPressEnter={handleBlur}
        />
      </Popconfirm>
    </>
  );
};

export default EditablePosition;;