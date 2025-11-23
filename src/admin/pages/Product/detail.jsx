import { useEffect, useState } from "react";
import {
  Card,
  Typography,
  notification,
  Tag,
  Image,
  Space,
  Button,
  Table,
  Switch,
  Badge,
  Popconfirm,
  Row,
  Col,
  InputNumber,
  Spin,
  Empty,
  Modal,
  Form,
  Input,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  StarFilled,
  CloseCircleOutlined,
  SmileOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { GET, POST, PATCH, DELETE } from "../../../utils/requests";
import ImageGallery from "../../components/common/ImageDetail";
import GoBack from "../../components/common/GoBack";
import UploadMultipleImages from "../../components/common/UploadMultipleImages";
import formatter from "../../../shared/helper/moneyFormatter";

const { Title, Text } = Typography;

const ProductDetail = () => {
  const [api, contextHolder] = notification.useNotification();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({});
  const [variants, setVariants] = useState([]);

  // Theo dõi thay đổi
  const [editedData, setEditedData] = useState({}); // { variantId: { field: value } }
  const [saving, setSaving] = useState(false);

  // Modal thêm variant
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Fetch sản phẩm
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const result = await GET(`/api/v1/admin/products/detail/${id}`);
        setProduct(result.data);
        setVariants(result.data.variants || []);
      } catch (error) {
        console.log("chay loi vao day");
        api.open({
          message: "Có lỗi khi hiển thị thông tin sản phẩm! Vui lòng thử lại",
          description: error.message,
          showProgress: true,
          pauseOnHover: true,
          icon: <CloseCircleOutlined style={{ color: 'red' }} />,
          placement: "topRight"
        });
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id, api]);

  // Inline update (chỉ UI + lưu vào editedData) => Chứa id của variants và các thuộc tính + giá trị tương ứng đã điều chỉnh
  const handleInlineUpdate = (variantId, field, value) => {
    setVariants((prev) =>
      prev.map((v) => (v._id === variantId ? { ...v, [field]: value } : v))
    );
    setEditedData((prev) => ({
      ...prev,
      [variantId]: { ...(prev[variantId] || {}), [field]: value },
    }));
  };

  // Lưu tất cả thay đổi
  const handleSaveAll = async () => {
    if (Object.keys(editedData).length === 0) return;
    setSaving(true);
    try {
      const payload = Object.entries(editedData).map(([id, changes]) => ({
        _id: id,
        ...changes,
      }));
      await PATCH("/api/v1/admin/variants/bulk-update", payload);
      api.open({
        message: 'Cập nhật thành công',
        description: "Đã lưu tất cả thay đổi !",
        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight"
      });
      setEditedData({});
    } catch (err) {
      api.open({
        message: "Có lỗi khi cập nhật! Vui lòng thử lại",
        description: err.message,
        showProgress: true,
        pauseOnHover: true,
        icon: <CloseCircleOutlined style={{ color: 'red' }} />,
        placement: "topRight"
      });
    } finally {
      setSaving(false);
    }
  };

  // Xóa variant
  const handleDeleteVariant = async (variantId) => {
    try {
      await DELETE(`/api/v1/admin/variants/delete/${variantId}`);
      setVariants((prev) => prev.filter((v) => v._id !== variantId));
      api.open({
        message: 'Xóa nhật thành công',
        description: "Biến thể đã được xóa !",
        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight"
      });
    } catch (err) {
      api.open({
        message: "Có lỗi khi xóa biến thể! Vui lòng thử lại",
        description: err.message,
        showProgress: true,
        pauseOnHover: true,
        icon: <CloseCircleOutlined style={{ color: 'red' }} />,
        placement: "topRight"
      });
    }
  };

  // Thêm variant mới
  const handleAddVariant = async (values) => {
    try {
      const payload = {
        product_id: id,
        ...values
      };
      console.log(payload);
      const res = await POST("/api/v1/admin/variants/create", {
        product_id: id,
        ...values,
      });
      setVariants((prev) => [...prev, res.data]);
      api.open({
        message: 'Thêm biến thể thành công',
        description: "",
        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight"
      });
      setModalOpen(false);
      form.resetFields();
    } catch (err) {
      api.open({
        message: "Có lỗi khi thêm mới! Vui lòng thử lại",
        description: err.message,
        showProgress: true,
        pauseOnHover: true,
        icon: <CloseCircleOutlined style={{ color: 'red' }} />,
        placement: "topRight"
      });
    }
  };

  const getColorValue = (colorName) => {
    if (!colorName) return "#cccccc";
    const lower = colorName.toLowerCase().trim();
    if (lower.includes("đen") || lower.includes("black")) return "#000000";
    if (lower.includes("trắng") || lower.includes("white")) return "#ffffff";
    if (lower.includes("đỏ") || lower.includes("red")) return "#ff0000";
    if (lower.includes("xanh")) return "#1890ff";
    if (lower.includes("vàng") || lower.includes("gold")) return "#ffd700";
    if (lower.includes("bạc") || lower.includes("silver")) return "#c0c0c0";
    if (lower.includes("hồng") || lower.includes("pink")) return "#ff85c0";
    return "#999999";
  };

  const columns = [
    // Giữ nguyên columns của bạn + thêm highlight
    {
      title: "Ảnh", width: 90, align: "center",
      render: (_, record) => (
        <Image width={60} height={60}
          src={record.images?.[0] || product?.thumbnail?.[0] || "/no-image.png"}
          style={{ objectFit: "cover", borderRadius: 6 }}
          fallback="/no-image.png"
        />
      ),
    },
    {
      title: "Màu", width: 90, align: "center",
      render: (_, record) => (
        <Space>
          <div style={{
            width: 20, height: 20, borderRadius: "50%",
            backgroundColor: getColorValue(record.color),
            border: "2px solid #f0f0f0", boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }} />
          <Text strong>{record.color || "-"}</Text>
        </Space>
      ),
    },
    { title: "Dung lượng", dataIndex: "storage", width: 90, align: "center" },
    { title: "Giá gốc", align: "center", width: 150,
      render: (_, record) => (
        <InputNumber
          formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          parser={(v) => v.replace(/,/g, "")}
          value={record.price}
          onChange={(v) => handleInlineUpdate(record._id, "price", v)}
          style={{ width: "100%" }} min={0}
        />
      ),
    },
    { title: "Giảm %", align: "center", width: 100,
      render: (_, record) => (
        <InputNumber min={0} max={100}
          value={record.discountPercentage || 0}
          onChange={(v) => handleInlineUpdate(record._id, "discountPercentage", v)}
          addonAfter="%"
        />
      ),
    },
    { title: "Giá bán", align: "center", width: 120,
      render: (_, record) => {
        const final = record.price * (1 - (record.discountPercentage || 0) / 100);
        return <Text strong type="danger">{final.toLocaleString("vi-VN")} ₫</Text>;
      },
    },
    { title: "Tồn kho", align: "center", width: 70,
      render: (_, record) => (
        <InputNumber min={0} value={record.stock}
          onChange={(v) => handleInlineUpdate(record._id, "stock", v)}
          status={record.stock === 0 ? "error" : ""}
        />
      ),
    },
    { title: "Trạng thái", width: 150, align: "center",
      render: (_, record) => (
        <Switch
          checked={record.status === "active"}
          checkedChildren="Hoạt động" unCheckedChildren="Dừng hoạt động"
          onChange={(c) => handleInlineUpdate(record._id, "status", c ? "active" : "inactive")}
        />
      ),
    },
    { title: "", width: 40, align: "center",
      render: (_, record) => (
        <Popconfirm title="Xóa biến thể này?" onConfirm={()=>handleDeleteVariant(record._id)}>
          <Button size="small" danger type="link" icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  if (loading) {
    return (
      <>
        {contextHolder} 
        <Spin fullscreen tip="Đang tải chi tiết sản phẩm..." />
      </>
    );
  }

  const hasUnsavedChanges = Object.keys(editedData).length > 0;

  return (
    <>
      {contextHolder}
      <div style={{ padding: 24, background: "#f9f9f9", minHeight: "100vh" }}>
        <div style={{ marginBottom: 24, textAlign: "right" }}>
          <Space size="middle">
            <GoBack />
            <Button type="primary" icon={<EditOutlined />}>Chỉnh sửa sản phẩm</Button>
          </Space>
        </div>

        <Row gutter={[24, 16]}>
          {/* PHẦN ĐẦU GIỮ NGUYÊN 100% CỦA BẠN */}
          <Col xs={24} lg={8}>
            {product.thumbnail ? (
              <ImageGallery images={product.thumbnail} />
            ) : (
              // giữ nguyên fallback ảnh của bạn
              <div style={{ width: '100%', aspectRatio: '1/1' }}>
                <Image width='100%' height='100%' src="error"
                  fallback="data:image/png;base64,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" />
                <h4 style={{ textAlign: 'center' }}>Chưa có hình ảnh minh họa !</h4>
              </div>
            )}
          </Col>

          <Col xs={24} lg={16}>
            <Badge.Ribbon text={product.position}>
              <Card>
                <Space direction="vertical" size={12} style={{ width: "100%" }}>
                  <div>
                    <Title level={2}>{product.title}</Title>
                    <Space wrap>
                      <Text copyable>SEO : <code>{product.slug}</code></Text>
                      {product.featured && <StarFilled style={{ color: "#ffb400", fontSize: 20 }} />}
                      <Tag color={product.status === "active" ? "green" : "red"} size="large">
                        {product.status === "active" ? "Đang bán" : "Tạm dừng"}
                      </Tag>
                    </Space>
                  </div>
                  <Space><Text strong>Danh mục: </Text><p style={{ margin: 0 }}>{product.category_id?.title}</p></Space>
                  <Space><Text strong>Số lượng còn lại: </Text><p style={{ margin: 0 }}>{product.stats?.totalStock}</p></Space>
                  <Space><Text strong>Lượt review: </Text><p style={{ margin: 0 }}>{product.stats?.totalVisits}</p></Space>
                  <Space><p style={{ margin: 0 }}>{product.description || "Chưa có mô tả sản phẩm"}</p></Space>
                </Space>
              </Card>
            </Badge.Ribbon>
          </Col>

          <Col xs={24}>
            <Card title="Thông số kỹ thuật chi tiết">
              <Space direction="vertical">
                <Text strong>Chi tiết: </Text>
                <div dangerouslySetInnerHTML={{ __html: product.detail || "Chưa có chi tiết sản phẩm" }} />
              </Space>
            </Card>
          </Col>

          {/* PHẦN BIẾN THỂ */}
          <Col xs={24}>
            <Card
              title={
                <Space>
                  <Title level={5} style={{ margin: 0 }}>Quản lý biến thể</Title>
                  <Badge count={variants.length} color="#1890ff" />
                  {hasUnsavedChanges && (
                    <Tag color="orange" icon={saving ? <Spin size="small" /> : null}>
                      {saving ? "Đang lưu..." : "Có thay đổi chưa lưu"}
                    </Tag>
                  )}
                </Space>
              }
              extra={
                <Space>
                  {hasUnsavedChanges && (
                    <Button type="primary" danger icon={<SaveOutlined />} loading={saving} onClick={handleSaveAll}>
                      Lưu tất cả
                    </Button>
                  )}
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
                    Thêm biến thể mới
                  </Button>
                </Space>
              }
            >
              {variants.length > 0 ? (
                <Table
                  columns={columns}
                  dataSource={variants}
                  rowKey="_id"
                  pagination={false}
                  bordered
                  scroll={{ x: 1300 }}
                  rowClassName={(r) => editedData[r._id] ? "edited-row" : ""}
                />
              ) : (
                <Empty description="Chưa có biến thể nào" />
              )}
            </Card>
          </Col>
        </Row>

        {/* Modal thêm variant */}
        <Modal
          title="Thêm biến thể mới"
          open={modalOpen}
          onCancel={() => {
            setModalOpen(false);
            form.resetFields();
          }}
          footer={null}
          width={800}
        >
          <Form form={form} onFinish={handleAddVariant} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="color"
                  label="Màu sắc"
                  rules={[
                    {
                      required: true,
                      message: "Nhập màu sắc"
                    }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="storage"
                  label="Dung lượng"
                  rules={[
                    {
                      required: true,
                      message: "Nhập dung lượng"
                    }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>

              {/* GIÁ */}
              <Col span={8}>
                <Form.Item
                  name="price"
                  label="Giá gốc"
                  rules={[
                    {
                      required: true,
                      message: "Nhập giá gốc"
                    }
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    formatter={formatter}
                    parser={(value) => value.replace(/,/g, "")}
                  />
                </Form.Item>
              </Col>

              {/* GIẢM % */}
              <Col span={8}>
                <Form.Item
                  name="discountPercentage"
                  label="Giảm %"
                  initialValue={0}
                >
                  <InputNumber
                    min={0}
                    max={100}
                    style={{ width: "100%" }}
                    addonAfter="%"
                  />
                </Form.Item>
              </Col>

              {/* TỒN KHO */}
              <Col span={8}>
                <Form.Item name="stock" label="Tồn kho" initialValue={0}>
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              {/* Ảnh */}
              <Col span={24}>
                <Form.Item name="images" label="Ảnh">
                  <UploadMultipleImages />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
              <Button onClick={() => setModalOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>
                Thêm ngay
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Highlight dòng có sự thay đổi */}
        <style>{`
          .edited-row { background-color: #fffbe6 !important; }
          .edited-row:hover { background-color: #fff1b8 !important; }
        `}</style>
      </div>
    </>
  );
};

export default ProductDetail;