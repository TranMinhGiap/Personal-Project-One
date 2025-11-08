import { Card, Form, Input, Col, Row, Select, InputNumber, Badge, notification } from 'antd';
import { useEffect, useState } from 'react';
import { GET } from '../../../../utils/requests';
import MyEditor from '../CKEditer';
import UploadMultipleImages from '../UploadMultipleImages';
import { WarningOutlined } from '@ant-design/icons';

const ProductGeneral = (props) => {

  const { form } = props;
  const [category, setCategory] = useState([]);
  const [api, contextHolder] = notification.useNotification();

  const { TextArea } = Input;

  const customRule = (message) => {
    const rule = [{ required: true, message: `${message}` }];
    return rule;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await GET("/api/v1/admin/product-category", {limit: 0});
        setCategory(result.data);
      } catch (error) {
        api.open({
          message: "Có lỗi khi hiển thị danh mục sản phẩm! Vui lòng thử lại",
          description: error.message,
          showProgress: true,
          pauseOnHover: true,
          icon: <WarningOutlined style={{ color: 'red' }} />,
          placement: "topRight"
        });
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {contextHolder}
      <Card>
        <Form
          form={form}
          layout='vertical'
        >
          <Row gutter={{ sm: 16 }}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Tên sản phẩm"
                name="title"
                rules={customRule("Nhập tên sản phẩm")}
              >
                <Input placeholder="Tên sản phẩm" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Danh mục sản phẩm"
                name="category_id"
                rules={customRule("Chọn 1 danh mục sản phẩm")}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder="Chọn danh mục sản phẩm"
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={category.map(item => ({
                    label: item.title,
                    value: item["_id"]
                  }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={4}>
              <Form.Item
                label="Vị trí"
                name="position"
              >
                <InputNumber placeholder="Tự động" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                label="Mô tả"
                name="description"
              >
                <TextArea 
                  rows={7} 
                  placeholder="Mô tả ngắn ..." 
                  maxLength={1200} 
                  showCount
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                label="Chi tiết"
                name="detail"
              >
                <MyEditor />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label="Ảnh" 
                name="thumbnail"
                getValueFromEvent={(value) => value} 
              >
                <UploadMultipleImages />
              </Form.Item>
            </Col>
            
            <Col xs={15} sm={9} md={7} lg={4}>
              <Form.Item label="Trạng thái" name="status" initialValue="active">
                <Select
                  options={[
                    { value: 'active', label: <Badge status="success" text="Hoạt động" /> },
                    { value: 'inactive', label: <Badge status="error" text="Ngừng hoạt động" /> }
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={15} sm={9} md={7} lg={4}>
              <Form.Item label="Đặc điểm" name="featured" initialValue={false}>
                <Select
                  options={[
                    { value: true, label: <Badge status="error" text="Nổi bật" /> },
                    { value: false, label: <Badge status="success" text="Bình thường" /> }
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
};

export default ProductGeneral;