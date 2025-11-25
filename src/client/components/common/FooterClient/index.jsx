import { Row, Col, Input, Space } from "antd";
import {
  FacebookFilled,
  YoutubeFilled,
  MailOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import "./FooterClient.scss";

const { Search } = Input;

const FooterClient = () => {
  return (
    <footer className="footer footer-client">

      {/* Newsletter */}
      <div className="footer-newsletter">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <h3>Đăng ký nhận tin khuyến mãi</h3>
            <p>Nhập email để nhận ưu đãi và khuyến mãi sớm nhất.</p>
          </Col>
          <Col xs={24} md={12}>
            <Search
              placeholder="Nhập email của bạn..."
              enterButton="Đăng ký"
              onSearch={() => {}}
              className="newsletter-input"
            />
          </Col>
        </Row>
      </div>

      {/* Main Footer */}
      <div className="footer-main">
        <Row gutter={[32, 24]}>
          
          {/* Cột 1 */}
          <Col xs={24} sm={12} md={8} lg={6}>
            <h4>SUPPER PHONE</h4>
            <p className="footer-desc">
              Hệ thống bán lẻ Apple chính hãng. Cam kết sản phẩm chất lượng cao
              với giá tốt nhất thị trường.
            </p>

            <ul className="footer-contact">
              <li><EnvironmentOutlined /> 123 Đường ABC, Hà Nội</li>
              <li><PhoneOutlined /> 1900 2138</li>
              <li><MailOutlined /> support@supperphone.vn</li>
              <li><ClockCircleOutlined /> 8:00 - 21:30 (T2 - CN)</li>
            </ul>
          </Col>

          {/* Cột 2 */}
          <Col xs={12} sm={12} md={8} lg={6}>
            <h4>Chính sách</h4>
            <ul className="footer-links">
              <li>Chính sách bảo hành</li>
              <li>Chính sách đổi trả</li>
              <li>Chính sách giao hàng</li>
              <li>Bảo mật thông tin</li>
            </ul>
          </Col>

          {/* Cột 3 */}
          <Col xs={12} sm={12} md={8} lg={6}>
            <h4>Hỗ trợ khách hàng</h4>
            <ul className="footer-links">
              <li>Hướng dẫn mua hàng</li>
              <li>Thanh toán - trả góp</li>
              <li>Tra cứu đơn hàng</li>
              <li>Câu hỏi thường gặp</li>
            </ul>
          </Col>

          {/* Cột 4 */}
          <Col xs={24} sm={12} md={12} lg={6}>
            <h4>Kết nối với chúng tôi</h4>
            <Space size={12} className="footer-social">
              <FacebookFilled />
              <YoutubeFilled />
            </Space>

            <h4 className="payments-title">Hình thức thanh toán</h4>
            <div className="footer-payments">
              <span className="payment-tag">VISA</span>
              <span className="payment-tag">Mastercard</span>
              <span className="payment-tag">Momo</span>
              <span className="payment-tag">ZaloPay</span>
            </div>
          </Col>

        </Row>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} SUPPER PHONE - All rights reserved.
      </div>
    </footer>
  );
};

export default FooterClient;