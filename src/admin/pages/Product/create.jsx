import { Tabs, Row, Col, Button, Flex, Form, notification, Popconfirm } from 'antd';
import { WarningOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import ProductVariant from '../../components/common/Product/productVariant';
import ProductGeneral from '../../components/common/Product/productGeneral';
import GoBack from '../../components/common/GoBack';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { POST } from '../../../utils/requests';

const CreateProduct = () => {

  const [formGeneral] = Form.useForm();
  const [formVariant] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [open, setOpen] = useState(false);
  const [activeKey, setActiveKey] = useState('1');
  const navigate = useNavigate();

  const items = [
    {
      label: 'General',
      key: '1',
      children: <ProductGeneral form={formGeneral}/>,
    },
    {
      label: 'Variant',
      key: '2',
      children: <ProductVariant form={formVariant}/>,  
    }
  ];

  const getPayload = async () => {
    try {
      const general = await formGeneral.validateFields();
      const variants = await formVariant.validateFields();
      return {
        ...general,
        variants: variants.variants || [], 
      };
    } catch (error) {
      console.log("Validation failed:", error);
      api.open({
        message: "Cần nhập đầy đủ thông tin !",
        description: "Kiểm tra lại xem thông tin đã được nhập đầy đủ chưa",
        showProgress: true,
        pauseOnHover: true,
        icon: <WarningOutlined style={{ color: 'red' }} />,
        placement: "topRight"
      });
      return null;
    }
  };

  const addProduct = async (payload) => {
    try {
      await POST('/api/v1/admin/products/create', payload)
      formGeneral.resetFields();
      formVariant.resetFields();
      navigate("/admin/products", { state: { success: true }});
    } catch (error) {
      api.open({
        message: "Có lỗi khi thêm sản phẩm ! Vui lòng thử lại",
        description: error.message,
        showProgress: true,
        pauseOnHover: true,
        icon: <WarningOutlined style={{ color: 'red' }} />,
        placement: "topRight"
      });
    }
  }

  const handleSubmit = async () => {
    // lấy payload
    const payload = await getPayload();
    // Kiểm tra payload (khi validate lỗi sẽ không có payload)
    if(!payload){
      return;
    }
    // Nếu có payload mới kiểm tra variants
    if (!payload.variants?.length) {
      setOpen(true);
      return;
    }
    // call api thêm sản phẩm
    await addProduct(payload)
  };

  const handleConfirm = async () => {
    const payload = await getPayload();
    if (payload) {
      await addProduct(payload);
    } else {
      api.open({
        message: "Có lỗi khi thêm sản phẩm ! Vui lòng thử lại",
        description: "Chưa lấy được dữ liệu của sản phẩm",
        showProgress: true,
        pauseOnHover: true,
        icon: <WarningOutlined style={{ color: 'red' }} />,
        placement: "topRight"
      });
    }
    setOpen(false);
  }

  const handleCancel = () => {
    setOpen(false); 
    setActiveKey('2');
  };

  return (
    <>
      {contextHolder}
      <Flex align='center' justify='end' gap={8}>
        <Popconfirm
          title="Chưa có biến thể"
          description="Quay lại hoặc tiếp tục để thêm sản phẩm"
          open={open} 
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          okText="Tiếp tục"
          cancelText="Quay lại"
        >
          <Button
            type="primary"
            onClick={handleSubmit}
            icon={<AppstoreAddOutlined />}
          >
            Thêm mới
          </Button>
        </Popconfirm>
        <GoBack />
      </Flex>
      <Row>
        <Col xs={24}>
          <Tabs
            activeKey={activeKey}  
            onChange={setActiveKey}
            centered
            items={items}
          />
        </Col>
      </Row>
    </>
  );
};

export default CreateProduct;