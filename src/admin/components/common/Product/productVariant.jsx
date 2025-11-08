import { Form, Input, InputNumber, Button, Table, Row, Col } from 'antd';
import { DeleteOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import UploadMultipleImages from '../UploadMultipleImages';
import useColumnFilter from '../../../../shared/hooks/useColumnFilter';

const ProductVariant = (props) => {
  const { form } = props;

  const getFieldValue = (name, field) => {
    return form.getFieldValue(['variants', name, field]);
  };
  
  const colorFilter = useColumnFilter({
    dataIndex: 'color',
    getFieldValue: (name) => getFieldValue(name, 'color'),
    placeholder: 'Tìm kiếm màu sắc (có dấu hoặc không)...',
  })

  // Form.List logic
  const renderVariants = (fields, { add, remove }) => {
    const columns = [
      // {
      //   title: 'STT',
      //   key: 'index',
      //   width: 60,
      //   render: (_, __, index) => index + 1,
      // },
      {
        title: 'Màu Sắc',
        dataIndex: 'color',
        key: 'color',
        ...colorFilter,
        render: (_, record) => (
          <Form.Item  
            name={[record.name, 'color']}
            rules={[{ required: true, message: 'Nhập màu sắc' }]}
            style={{ margin: 0 }}
          >
            <Input placeholder="Gold" />
          </Form.Item>
        ),
      },
      {
        title: 'Dung Lượng',
        dataIndex: 'storage',
        key: 'storage',
        render: (_, record) => (
          <Form.Item
            name={[record.name, 'storage']}
            rules={[{ required: true, message: 'Nhập dung lượng' }]}
            style={{ margin: 0 }}
          >
            <Input placeholder="128GB" />
          </Form.Item>
        ),
      },
      {
        title: 'Giá Bán (VNĐ)',
        dataIndex: 'price',
        key: 'price',
        render: (_, record) => (
          <Form.Item
            name={[record.name, 'price']}
            rules={[{ required: true, type: 'number', min: 0, message: 'Nhập giá!' }]}
            style={{ margin: 0 }}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="20000000"
              formatter={(value) => value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value?.replace(/,/g, '')}
            />
          </Form.Item>
        ),
      },
      {
        title: 'Giảm giá (%)',
        dataIndex: 'discountPercentage',
        key: 'discountPercentage',
        render: (_, record) => (
          <Form.Item
            name={[record.name, 'discountPercentage']}
            style={{ margin: 0 }}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="10"
            />
          </Form.Item>
        ),
      },
      {
        title: 'Số Lượng Tồn',
        dataIndex: 'stock',
        key: 'stock',
        render: (_, record) => (
          <Form.Item
            name={[record.name, 'stock']}
            rules={[{ required: true, type: 'number', min: 0, message: 'Stock phải >= 0!' }]}
            style={{ margin: 0 }}
          >
            <InputNumber style={{ width: '100%' }} placeholder="10" />
          </Form.Item>
        ),
      },
      {
        title: '',
        key: 'action',
        align: 'center',
        width: 40,
        render: (_, record) => (
          <DeleteOutlined
            style={{ fontSize: 20, color: '#ff4d4f', cursor: 'pointer'}}
            onClick={() => remove(record.name)} 
          />
        ),
      },
    ];

    return (
      <>
        <Row justify="end">
          <Col>
            <Button
              type="dashed"
              style={{ marginBottom: 16 }}
              onClick={() => add()}
              icon={<AppstoreAddOutlined  />}
            >
              Thêm biến thể
            </Button>
          </Col>
        </Row>
        <Table
          dataSource={fields}
          columns={columns}
          rowKey="name"
          scroll={{ y: 390 }}
          tableLayout="fixed"
          pagination={false}
          bordered
          size="small"
          style={{ marginBottom: 16 }}
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ padding: 16, background: '#fafafa' }}>
                <Form.Item
                  name={[record.name, 'images']}
                  style={{ margin: 0 }}
                >
                  <UploadMultipleImages />
                </Form.Item>
              </div>
            ),
            rowExpandable: () => true, 
          }}
        />
      </>
    );
  };

  return (
    <Form
      form={form}
      name="product-variants"
      autoComplete="off"
      initialValues={{ variants: [{}] }} 
    >
      <Form.List name="variants">
        {renderVariants}
      </Form.List>
    </Form>
  );
};

export default ProductVariant;