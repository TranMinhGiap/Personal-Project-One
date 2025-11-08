import { SearchOutlined } from '@ant-design/icons';
import { Input, Button, Row, Col } from 'antd';
import { useCallback } from 'react';
import normalizeVietnamese from '../helper/normalizeVietnamese';

const useColumnFilter = ({ 
  dataIndex, 
  getFieldValue, // Callback để lấy giá trị field từ form, ví dụ: (name) => form.getFieldValue(['variants', name, dataIndex])
  placeholder = 'Tìm kiếm...',
  filterSearch = true 
}) => {
  const filterDropdown = useCallback(({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
    <div style={{ padding: 8 }}>
      <Input
        placeholder={placeholder}
        value={selectedKeys[0]}
        onChange={(e) => {
          const value = e.target.value ? [e.target.value] : [];
          setSelectedKeys(value);
          // Real-time filter: apply ngay khi gõ, không đóng dropdown
          confirm({ closeDropdown: false });
        }}
        style={{ width: 188, marginBottom: 8, display: 'block' }}
        autoFocus
      />
      <Row>
        <Col span={12}>
          <Button
            type="primary"
            onClick={() => confirm()} // Đóng dropdown
            size="small"
            style={{ width: 90 }}
          >
            Tìm kiếm
          </Button>
        </Col>
        <Col span={12}>
          <Button
            onClick={() => clearFilters && clearFilters()}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Col>
      </Row>
    </div>
  ), [placeholder]);

  const filterIcon = useCallback((filtered) => (
    <SearchOutlined style={{ color: filtered ? '#0114e3ff' : '#bfbfbf' }} />
  ), []);

  const onFilter = useCallback((value, record) => {
    const fieldValue = getFieldValue(record.name); // Gọi callback để lấy giá trị
    const normalizedField = normalizeVietnamese(fieldValue);
    const normalizedValue = normalizeVietnamese(value);
    return normalizedField.includes(normalizedValue);
  }, [getFieldValue]);

  // Fix: Thay onFilterDropdownOpenChange bằng filterDropdownProps với onOpenChange
  const filterDropdownProps = useCallback((open) => {
    if (open) {
      setTimeout(() => {
        const input = document.querySelector('.ant-table-filter-dropdown input');
        if (input) input.focus();
      }, 0);
    }
  }, []);

  return {
    filterSearch,
    filterDropdown,
    filterIcon,
    onFilter,
    filterDropdownProps,  
  };
};

export default useColumnFilter;