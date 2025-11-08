// import { useState, useEffect } from 'react';
// import { Upload, Modal, message, Spin, Progress } from 'antd';
// import { PlusOutlined, EyeOutlined, DeleteOutlined, PictureOutlined } from '@ant-design/icons';
// import { ReactSortable } from 'react-sortablejs';

// const { confirm } = Modal;

// const UploadMultipleImages = ({ value = [], onChange, uploading: externalUploading = false }) => {
//   const [images, setImages] = useState(value);
//   const [fileList, setFileList] = useState([]); // { uid, name, status, percent, url? }
//   const [uploading, setUploading] = useState(externalUploading);
//   const [previewVisible, setPreviewVisible] = useState(false);
//   const [previewImage, setPreviewImage] = useState('');

//   useEffect(() => {
//     setImages(value);
//   }, [value]);

//   const handleUpload = async ({ file, onSuccess, onError }) => {
//     const newFile = { uid: file.uid, name: file.name, status: 'uploading', percent: 0 };
//     setFileList(prev => [...prev, newFile]);

//     const interval = setInterval(() => {
//       setFileList(prev =>
//         prev.map(f => (f.uid === file.uid ? { ...f, percent: Math.min((f.percent || 0) + 10, 90) } : f))
//       );
//     }, 300);

//     setUploading(true);
//     const formData = new FormData();
//     formData.append('upload', file);

//     try {
//       const res = await fetch('http://localhost:3000/api/v1/admin/upload-cloud-image', {
//         method: 'POST',
//         body: formData,
//       });
//       if (!res.ok) throw new Error(`Upload thất bại: ${res.statusText}`);
//       const data = await res.json();

//       let imageUrl = data.url || (data.urls?.length ? data.urls[0] : '');
//       if (!imageUrl) throw new Error('Không có URL từ server');

//       const baseHost = process.env.REACT_APP_API_HOST || 'http://localhost:3000';
//       if (!imageUrl.startsWith('http')) {
//         imageUrl = `${baseHost}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
//       }

//       clearInterval(interval);

//       // update that file to success (use prev state to avoid stale fileList)
//       setFileList(prev => prev.map(f => (f.uid === file.uid ? { ...f, status: 'success', url: imageUrl, percent: 100 } : f)));

//       const updatedImages = [...images, imageUrl];
//       setImages(updatedImages);
//       onChange && onChange(updatedImages);

//       onSuccess && onSuccess({ url: imageUrl });
//       message.success('Tải ảnh thành công!');
//     } catch (err) {
//       clearInterval(interval);
//       setFileList(prev => prev.map(f => (f.uid === file.uid ? { ...f, status: 'error', percent: 0 } : f)));
//       onError && onError(err);
//       message.error(`Tải ảnh thất bại: ${err.message}`);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const removeFile = (uid) => {
//     setFileList(prev => prev.filter(f => f.uid !== uid));
//   };

//   const handleReorder = (newOrder) => {
//     // newOrder contains items we passed (id + file props)
//     // We expect items with status success only handled by sortable
//     const sortableList = newOrder
//       .filter(item => item.status === 'success')
//       .map((item, i) => ({ id: i, url: item.url, status: 'success' }));
//     const newImages = sortableList.map(item => item.url);
//     setImages(newImages);
//     onChange && onChange(newImages);
//   };

//   const handlePreview = (url) => {
//     setPreviewImage(url);
//     setPreviewVisible(true);
//   };

//   const handleDelete = (url) => {
//     confirm({
//       title: 'Xóa ảnh này?',
//       content: 'Bạn có chắc chắn muốn xóa ảnh khỏi danh sách không?',
//       okText: 'Xóa',
//       okType: 'danger',
//       cancelText: 'Hủy',
//       onOk: () => {
//         const updated = images.filter(img => img !== url);
//         setImages(updated);
//         onChange && onChange(updated);
//         message.success('Đã xóa ảnh!');
//       },
//     });
//   };

//   // Render thumbnail theo status
//   const renderThumbnail = (file, index) => {
//     const size = index === 0 ? 200 : 100;
//     const isMain = index === 0;
//     const fileName = file.name ? (file.name.length > 12 ? file.name.substring(0, 12) + '...' : file.name) : 'image...';

//     if (file.status === 'uploading') {
//       return (
//         <div
//           style={{
//             width: size,
//             height: size,
//             borderRadius: 8,
//             background: '#ffffff',
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             position: 'relative',
//             border: '1px dashed #d9d9d9',
//             flexShrink: 0,
//           }}
//         >
//           <PictureOutlined style={{ fontSize: 28, color: '#bfbfbf', marginBottom: 8 }} />
//           <div style={{ width: '80%', marginBottom: 6 }}>
//             <Progress percent={file.percent || 0} size="small" status="active" showInfo={false} />
//           </div>
//           <span style={{ fontSize: 12, color: '#8c8c8c' }}>Uploading...</span>
//           <span style={{ fontSize: 11, color: '#bfbfbf', marginTop: 4 }}>{fileName}</span>
//         </div>
//       );
//     }

//     if (file.status === 'error') {
//       // CHỈ HIỂN THỊ ICON + TÊN + CHỮ "Xóa" TRÊN GÓC PHẢI (bỏ dấu X đỏ)
//       return (
//         <div
//           style={{
//             width: size,
//             height: size,
//             border: '1px solid #ff4d4f',
//             borderRadius: 8,
//             background: '#ffffff',
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             position: 'relative',
//             flexShrink: 0,
//             padding: 8,
//             boxSizing: 'border-box',
//           }}
//         >
//           <PictureOutlined style={{ fontSize: 28, color: '#ff4d4f', marginBottom: 8 }} />
//           <div style={{ fontSize: 12, color: '#ff4d4f', textAlign: 'center' }}>{fileName}</div>

//           {/* CHỮ "Xóa" ở góc phải - vẫn giữ */}
//           <div
//             style={{
//               position: 'absolute',
//               top: 6,
//               right: 8,
//               fontSize: 12,
//               color: '#ff4d4f',
//               cursor: 'pointer',
//             }}
//             onClick={() => removeFile(file.uid)}
//           >
//             Xóa
//           </div>
//         </div>
//       );
//     }

//     // success
//     return (
//       <div
//         style={{
//           width: size,
//           height: size,
//           border: isMain ? '2px solid #1890ff' : '1px solid #d9d9d9',
//           borderRadius: 8,
//           overflow: 'hidden',
//           position: 'relative',
//           cursor: 'grab',
//           flexShrink: 0,
//         }}
//         className="group"
//       >
//         <img src={file.url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
//         <div
//           style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             background: 'rgba(0,0,0,0.4)',
//             opacity: 0,
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             gap: 16,
//             transition: 'opacity 0.3s',
//           }}
//           className="hover-overlay"
//           onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
//           onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
//         >
//           <EyeOutlined onClick={() => handlePreview(file.url)} style={{ color: '#fff', fontSize: 22, cursor: 'pointer' }} />
//           <DeleteOutlined onClick={() => handleDelete(file.url)} style={{ color: '#ff4d4f', fontSize: 22, cursor: 'pointer' }} />
//         </div>
//         {isMain && (
//           <div
//             style={{
//               position: 'absolute',
//               top: 6,
//               left: 6,
//               background: '#1890ff',
//               color: '#fff',
//               fontSize: 10,
//               padding: '2px 6px',
//               borderRadius: 4,
//             }}
//           >
//             Main
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <>
//       <div
//         style={{
//           display: 'flex',
//           alignItems: 'flex-start',
//           gap: 12,
//           overflowX: 'auto',
//           paddingBottom: 8,
//           scrollbarWidth: 'none',
//           msOverflowStyle: 'none',
//         }}
//         className="hide-scrollbar"
//       >
//         <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap: 12 }}>
//           <ReactSortable
//             list={fileList.map((file, i) => ({ id: i, ...file }))}
//             setList={handleReorder}
//             animation={200}
//             style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap: 12 }}
//           >
//             {fileList.map((file, index) => (
//               <div key={file.uid}>{renderThumbnail(file, index)}</div>
//             ))}
//           </ReactSortable>
//         </div>

//         {/* Nút upload: spin size nhỏ */}
//         <div
//           style={{
//             width: 100,
//             height: 100,
//             border: uploading ? '1px solid #d9d9d9' : '1px dashed #d9d9d9',
//             borderRadius: 8,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             flexShrink: 0,
//             background: '#fafafa',
//             transition: 'all 0.3s',
//             cursor: uploading ? 'not-allowed' : 'pointer',
//             position: 'relative',
//           }}
//           onMouseEnter={(e) => {
//             if (!uploading) e.currentTarget.style.borderColor = '#1890ff';
//           }}
//           onMouseLeave={(e) => {
//             if (!uploading) e.currentTarget.style.borderColor = '#d9d9d9';
//           }}
//         >
//           <Upload
//             accept="image/*"
//             multiple
//             showUploadList={false}
//             customRequest={handleUpload}
//             disabled={uploading}
//             fileList={fileList}
//             onRemove={removeFile}
//           >
//             {uploading ? <Spin size="small" /> : <PlusOutlined style={{ fontSize: 24, color: '#8c8c8c' }} />}
//           </Upload>
//         </div>
//       </div>

//       <Modal open={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)} centered>
//         <img alt="preview" style={{ width: '100%' }} src={previewImage} />
//       </Modal>
//     </>
//   );
// };

// export default UploadMultipleImages;

// // ============================== Final ==============================

// import { useState, useEffect } from 'react';
// import { Upload, Modal, message, Spin, Progress, Popconfirm  } from 'antd';
// import { PlusOutlined, EyeOutlined, DeleteOutlined, PictureOutlined } from '@ant-design/icons';
// import { ReactSortable } from 'react-sortablejs';

// const UploadMultipleImages = ({ value = [], onChange, uploading: externalUploading = false }) => {
//   const [images, setImages] = useState(value);
//   const [fileList, setFileList] = useState([]); 
//   const [uploading, setUploading] = useState(externalUploading);
//   const [previewVisible, setPreviewVisible] = useState(false);
//   const [previewImage, setPreviewImage] = useState('');

//   useEffect(() => {
//     setImages(value);
//   }, [value]);

//   const handleUpload = async ({ file, onSuccess, onError }) => {
//     const newFile = { uid: file.uid, name: file.name, status: 'uploading', percent: 0 };
//     setFileList(prev => [...prev, newFile]);

//     const interval = setInterval(() => {
//       setFileList(prev =>
//         prev.map(f => (f.uid === file.uid ? { ...f, percent: Math.min((f.percent || 0) + 10, 90) } : f))
//       );
//     }, 300);

//     setUploading(true);
//     const formData = new FormData();
//     formData.append('upload', file);

//     try {
//       const res = await fetch('http://localhost:3000/api/v1/admin/upload-cloud-image', {
//         method: 'POST',
//         body: formData,
//       });
//       if (!res.ok) throw new Error(`Upload thất bại: ${res.statusText}`);
//       const data = await res.json();

//       let imageUrl = data.url || (data.urls?.length ? data.urls[0] : '');
//       if (!imageUrl) throw new Error('Không có URL từ server');

//       const baseHost = process.env.REACT_APP_API_HOST || 'http://localhost:3000';
//       if (!imageUrl.startsWith('http')) {
//         imageUrl = `${baseHost}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
//       }

//       clearInterval(interval);

//       // update that file to success (use prev state to avoid stale fileList)
//       setFileList(prev => prev.map(f => (f.uid === file.uid ? { ...f, status: 'success', url: imageUrl, percent: 100 } : f)));

//       const updatedImages = [...images, imageUrl];
//       setImages(updatedImages);
//       onChange && onChange(updatedImages);

//       onSuccess && onSuccess({ url: imageUrl });
//       message.success('Tải ảnh thành công!');
//     } catch (err) {
//       clearInterval(interval);
//       setFileList(prev => prev.map(f => (f.uid === file.uid ? { ...f, status: 'error', percent: 0 } : f)));
//       onError && onError(err);
//       message.error(`Tải ảnh thất bại: ${err.message}`);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const removeFile = (uid) => {
//     setFileList(prev => prev.filter(f => f.uid !== uid));
//   };

//   const handleReorder = (newOrder) => {
//     // Cập nhật fileList theo thứ tự mới (tất cả items, bao gồm temp như uploading/error)
//     const newFileList = newOrder.map(({ id, ...rest }) => ({
//       uid: id,
//       ...rest,
//     }));
//     setFileList(newFileList);

//     // Extract chỉ success urls để update images
//     const newImages = newFileList
//       .filter((item) => item.status === 'success')
//       .map((item) => item.url);

//     setImages(newImages);
//     onChange && onChange(newImages);
//   };

//   const handlePreview = (url) => {
//     setPreviewImage(url);
//     setPreviewVisible(true);
//   };

//   const handleDelete = (url) => {
//     const updated = images.filter(img => img !== url);
//     alert(updated);
//     setImages(updated);
//     onChange && onChange(updated);   
//   };

//   // Render thumbnail theo status
//   const renderThumbnail = (file, index) => {
//     const size = index === 0 ? 200 : 100;
//     const isMain = index === 0;
//     const fileName = file.name ? (file.name.length > 12 ? file.name.substring(0, 12) + '...' : file.name) : 'image...';

//     if (file.status === 'uploading') {
//       return (
//         <div
//           style={{
//             width: size,
//             height: size,
//             borderRadius: 8,
//             background: '#ffffff',
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             position: 'relative',
//             border: '1px dashed #d9d9d9',
//             flexShrink: 0,
//           }}
//         >
//           <PictureOutlined style={{ fontSize: 28, color: '#bfbfbf', marginBottom: 8 }} />
//           <div style={{ width: '80%', marginBottom: 6 }}>
//             <Progress percent={file.percent || 0} size="small" status="active" showInfo={false} />
//           </div>
//           <span style={{ fontSize: 12, color: '#8c8c8c' }}>Uploading...</span>
//           <span style={{ fontSize: 11, color: '#bfbfbf', marginTop: 4 }}>{fileName}</span>
//         </div>
//       );
//     }

//     if (file.status === 'error') {
//       // CHỈ HIỂN THỊ ICON + TÊN + CHỮ "Xóa" TRÊN GÓC PHẢI (bỏ dấu X đỏ)
//       return (
//         <div
//           style={{
//             width: size,
//             height: size,
//             border: '1px solid #ff4d4f',
//             borderRadius: 8,
//             background: '#ffffff',
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             position: 'relative',
//             flexShrink: 0,
//             padding: 8,
//             boxSizing: 'border-box',
//           }}
//         >
//           <PictureOutlined style={{ fontSize: 28, color: '#ff4d4f', marginBottom: 8 }} />
//           <div style={{ fontSize: 12, color: '#ff4d4f', textAlign: 'center' }}>{fileName}</div>

//           {/* CHỮ "Xóa" ở góc phải - vẫn giữ */}
//           <div
//             style={{
//               position: 'absolute',
//               top: 6,
//               right: 8,
//               fontSize: 12,
//               color: '#ff4d4f',
//               cursor: 'pointer',
//             }}
//             onClick={() => removeFile(file.uid)}
//           >
//             Xóa
//           </div>
//         </div>
//       );
//     }

//     // success
//     return (
//       <div
//         style={{
//           width: size,
//           height: size,
//           border: isMain ? '2px solid #1890ff' : '1px solid #d9d9d9',
//           borderRadius: 8,
//           overflow: 'hidden',
//           position: 'relative',
//           cursor: 'grab',
//           flexShrink: 0,
//         }}
//         className="group"
//       >
//         <img src={file.url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
//         <div
//           style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             background: 'rgba(0,0,0,0.4)',
//             opacity: 0,
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             gap: 16,
//             transition: 'opacity 0.3s',
//           }}
//           className="hover-overlay"
//           onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
//           onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
//         >
//           <EyeOutlined onClick={() => handlePreview(file.url)} style={{ color: '#fff', fontSize: 22, cursor: 'pointer' }} />
//           {/* <DeleteOutlined onClick={() => handleDelete(file.url)} style={{ color: '#ff4d4f', fontSize: 22, cursor: 'pointer' }} /> */}
//           <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(file.url)}>
//             <DeleteOutlined style={{ color: '#ff4d4f', fontSize: 22, cursor: 'pointer' }} />
//           </Popconfirm>
//         </div>
//         {isMain && (
//           <div
//             style={{
//               position: 'absolute',
//               top: 6,
//               left: 6,
//               background: '#1890ff',
//               color: '#fff',
//               fontSize: 10,
//               padding: '2px 6px',
//               borderRadius: 4,
//             }}
//           >
//             Main
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <>
//       <div
//         style={{
//           display: 'flex',
//           alignItems: 'flex-start',
//           gap: 12,
//           overflowX: 'auto',
//           paddingBottom: 8,
//           scrollbarWidth: 'none',
//           msOverflowStyle: 'none',
//         }}
//         className="hide-scrollbar"
//       >
//         <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap: 12 }}>
//           <ReactSortable
//             list={fileList.map((file) => ({ id: file.uid, ...file }))}
//             setList={handleReorder}
//             animation={200}
//             style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap: 12 }}
//           >
//             {fileList.map((file, index) => (
//               <div key={file.uid}>{renderThumbnail(file, index)}</div>
//             ))}
//           </ReactSortable>
//         </div>

//         {/* Nút upload: spin size nhỏ */}
//         <div
//           style={{
//             width: 100,
//             height: 100,
//             border: uploading ? '1px solid #d9d9d9' : '1px dashed #d9d9d9',
//             borderRadius: 8,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             flexShrink: 0,
//             background: '#fafafa',
//             transition: 'all 0.3s',
//             cursor: uploading ? 'not-allowed' : 'pointer',
//             position: 'relative',
//           }}
//           onMouseEnter={(e) => {
//             if (!uploading) e.currentTarget.style.borderColor = '#1890ff';
//           }}
//           onMouseLeave={(e) => {
//             if (!uploading) e.currentTarget.style.borderColor = '#d9d9d9';
//           }}
//         >
//           <Upload
//             accept="image/*"
//             multiple
//             showUploadList={false}
//             customRequest={handleUpload}
//             disabled={uploading}
//             fileList={fileList}
//             onRemove={removeFile}
//           >
//             {uploading ? <Spin size="small" /> : <PlusOutlined style={{ fontSize: 24, color: '#8c8c8c' }} />}
//           </Upload>
//         </div>
//       </div>

//       <Modal open={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)} centered>
//         <img alt="preview" style={{ width: '100%' }} src={previewImage} />
//       </Modal>
//     </>
//   );
// };

// export default UploadMultipleImages;

// ====================================================================
import { useState, useEffect } from 'react';
import { Upload, Modal, message, Spin, Progress, Popconfirm } from 'antd';
import { PlusOutlined, EyeOutlined, DeleteOutlined, PictureOutlined } from '@ant-design/icons';
import { ReactSortable } from 'react-sortablejs';

const UploadMultipleImages = ({ value = [], onChange, uploading: externalUploading = false }) => {
  // 🔹 Fallback ngay từ đầu: Nếu value không phải array thì gán thành [] 
  const normalizedValue = Array.isArray(value) ? value : [];
  
  const [images, setImages] = useState(normalizedValue);  // Bắt đầu luôn là array
  const [fileList, setFileList] = useState([]); // { uid, name, status, percent, url? }
  const [uploading, setUploading] = useState(externalUploading);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    // Dùng normalizedValue để sync fileList từ existing URLs (không skip khi undefined)
    const currentUrls = fileList.filter(f => f.status === 'success').map(f => f.url);
    const isSame = JSON.stringify(currentUrls) === JSON.stringify(normalizedValue);
    if (isSame) return;

    // Chuyển các URL thành file object (chỉ cho ảnh đã có)
    const existingFiles = normalizedValue.map((url, index) => ({
      uid: `existing-${url}`, // Giữ ổn định theo URL
      name: url.split('/').pop() || `image-${index}.jpg`,
      status: 'success',
      url,
      percent: 100,
    }));

    // Giữ nguyên file đang upload hoặc lỗi
    setFileList(prev => {
      const uploadingOrError = prev.filter(f => f.status !== 'success');
      return [...existingFiles, ...uploadingOrError];
    });

    setImages(normalizedValue);  // Sync với normalized (luôn array)
  }, [normalizedValue]);  // Depend trên normalizedValue

  const handleUpload = async ({ file, onSuccess, onError }) => {
    const newFile = { uid: file.uid, name: file.name, status: 'uploading', percent: 0 };
    setFileList(prev => [...prev, newFile]);

    const interval = setInterval(() => {
      setFileList(prev =>
        prev.map(f => (f.uid === file.uid ? { ...f, percent: Math.min((f.percent || 0) + 10, 90) } : f))
      );
    }, 300);

    setUploading(true);
    const formData = new FormData();
    formData.append('upload', file);

    try {
      const res = await fetch('http://localhost:3000/api/v1/admin/upload-cloud-image', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error(`Upload thất bại: ${res.statusText}`);
      const data = await res.json();

      let imageUrl = data.url || (data.urls?.length ? data.urls[0] : '');
      if (!imageUrl) throw new Error('Không có URL từ server');

      const baseHost = process.env.REACT_APP_API_HOST || 'http://localhost:3000';
      if (!imageUrl.startsWith('http')) {
        imageUrl = `${baseHost}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
      }

      clearInterval(interval);

      // Update file to success
      setFileList(prev => prev.map(f => (f.uid === file.uid ? { ...f, status: 'success', url: imageUrl, percent: 100 } : f)));

      // Bây giờ images luôn là array → Spread an toàn
      const updatedImages = [...images, imageUrl];
      setImages(updatedImages);
      onChange && onChange(updatedImages);  // Trả array lên Form

      onSuccess && onSuccess({ url: imageUrl });
      message.success('Tải ảnh thành công!');
    } catch (err) {
      clearInterval(interval);
      setFileList(prev => prev.map(f => (f.uid === file.uid ? { ...f, status: 'error', percent: 0 } : f)));
      onError && onError(err);
      message.error(`Tải ảnh thất bại: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (uid) => {
    setFileList(prev => prev.filter(f => f.uid !== uid));
  };

  const handleReorder = (newOrder) => {
    // Cập nhật fileList theo thứ tự mới (tất cả items, bao gồm temp)
    const newFileList = newOrder.map(({ id, ...rest }) => ({
      uid: id,
      ...rest,
    }));
    setFileList(newFileList);

    // Extract chỉ success urls → Luôn array
    const newImages = newFileList
      .filter((item) => item.status === 'success')
      .map((item) => item.url);

    setImages(newImages);
    onChange && onChange(newImages);
  };

  const handlePreview = (url) => {
    setPreviewImage(url);
    setPreviewVisible(true);
  };

  const handleDelete = (url) => {
    // Xóa khỏi fileList (chỉ success items có url)
    setFileList(prev => prev.filter(f => f.status !== 'success' || f.url !== url));

    // Bây giờ images luôn là array → Filter an toàn
    const updated = images.filter(img => img !== url);
    setImages(updated);
    onChange && onChange(updated);  // Trả array lên Form

    message.success('Đã xóa ảnh!');
  };

  // Render thumbnail theo status
  const renderThumbnail = (file, index) => {
    const size = index === 0 ? 200 : 100;
    const isMain = index === 0;
    const fileName = file.name ? (file.name.length > 12 ? file.name.substring(0, 12) + '...' : file.name) : 'image...';

    if (file.status === 'uploading') {
      return (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: 8,
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            border: '1px dashed #d9d9d9',
            flexShrink: 0,
          }}
        >
          <PictureOutlined style={{ fontSize: 28, color: '#bfbfbf', marginBottom: 8 }} />
          <div style={{ width: '80%', marginBottom: 6 }}>
            <Progress percent={file.percent || 0} size="small" status="active" showInfo={false} />
          </div>
          <span style={{ fontSize: 12, color: '#8c8c8c' }}>Uploading...</span>
          <span style={{ fontSize: 11, color: '#bfbfbf', marginTop: 4 }}>{fileName}</span>
        </div>
      );
    }

    if (file.status === 'error') {
      return (
        <div
          style={{
            width: size,
            height: size,
            border: '1px solid #ff4d4f',
            borderRadius: 8,
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            flexShrink: 0,
            padding: 8,
            boxSizing: 'border-box',
          }}
        >
          <PictureOutlined style={{ fontSize: 28, color: '#ff4d4f', marginBottom: 8 }} />
          <div style={{ fontSize: 12, color: '#ff4d4f', textAlign: 'center' }}>{fileName}</div>

          <div
            style={{
              position: 'absolute',
              top: 6,
              right: 8,
              fontSize: 12,
              color: '#ff4d4f',
              cursor: 'pointer',
            }}
            onClick={() => removeFile(file.uid)}
          >
            Xóa
          </div>
        </div>
      );
    }

    // success
    return (
      <div
        style={{
          width: size,
          height: size,
          border: isMain ? '2px solid #1890ff' : '1px solid #d9d9d9',
          borderRadius: 8,
          overflow: 'hidden',
          position: 'relative',
          cursor: 'grab',
          flexShrink: 0,
        }}
        className="group"
      >
        <img src={file.url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.4)',
            opacity: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 16,
            transition: 'opacity 0.3s',
          }}
          className="hover-overlay"
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
        >
          <EyeOutlined onClick={() => handlePreview(file.url)} style={{ color: '#fff', fontSize: 22, cursor: 'pointer' }} />
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(file.url)}>
            <DeleteOutlined style={{ color: '#ff4d4f', fontSize: 22, cursor: 'pointer' }} />
          </Popconfirm>
        </div>
        {isMain && (
          <div
            style={{
              position: 'absolute',
              top: 6,
              left: 6,
              background: '#1890ff',
              color: '#fff',
              fontSize: 10,
              padding: '2px 6px',
              borderRadius: 4,
            }}
          >
            Main
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap', 
          alignItems: 'flex-start',
          gap: 12,
          overflowY: 'auto',
          border: "1px solid #ccced1",
          padding: "5px",
          borderRadius: 5,
          minHeight: 200,
          maxHeight: 400, 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        className="hide-scrollbar"
      >
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap: 12 }}>
          <ReactSortable
            list={fileList.map((file) => ({ id: file.uid, ...file }))}
            setList={handleReorder}
            animation={200}
            style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap: 12 }}
          >
            {fileList.map((file, index) => (
              <div key={file.uid}>{renderThumbnail(file, index)}</div>
            ))}
          </ReactSortable>
        </div>

        {/* Nút upload: spin size nhỏ */}
        <div
          style={{
            width: 100,
            height: 100,
            border: uploading ? '1px solid #d9d9d9' : '1px dashed #d9d9d9',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            background: '#fafafa',
            transition: 'all 0.3s',
            cursor: uploading ? 'not-allowed' : 'pointer',
            position: 'relative',
          }}
          onMouseEnter={(e) => {
            if (!uploading) e.currentTarget.style.borderColor = '#1890ff';
          }}
          onMouseLeave={(e) => {
            if (!uploading) e.currentTarget.style.borderColor = '#d9d9d9';
          }}
        >
          <Upload
            accept="image/*"
            multiple
            showUploadList={false}
            customRequest={handleUpload}
            disabled={uploading}
            fileList={fileList}
            onRemove={removeFile}
          >
            {uploading ? <Spin size="small" /> : <PlusOutlined style={{ fontSize: 24, color: '#8c8c8c' }} />}
          </Upload>
        </div>
      </div>

      <Modal open={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)} centered>
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default UploadMultipleImages;