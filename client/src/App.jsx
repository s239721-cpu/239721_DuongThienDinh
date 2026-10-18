import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ studentId: '', name: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  // Đường dẫn gốc chuẩn của API
  const API_URL = 'http://localhost:5000/api/students';

  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error('Lỗi lấy danh sách:', err);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Chỉ gửi name và email
        const updatePayload = { name: formData.name, email: formData.email };
        
        // Sửa chuẩn URL: http://localhost:5000/api/students/{editingId}
        const res = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatePayload)
        });

        if (res.ok) {
          alert('Cập nhật sinh viên thành công!');
          handleCancelEdit();
          fetchStudents();
        } else {
          alert('Lỗi cập nhật sinh viên!');
        }
      } else {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (res.ok) {
          alert('Thêm sinh viên thành công!');
          setFormData({ studentId: '', name: '', email: '' });
          fetchStudents();
        } else {
          alert('Lỗi thêm sinh viên!');
        }
      }
    } catch (err) {
      alert('Lỗi kết nối Server Backend!');
      console.error(err);
    }
  };

  const handleEdit = (s) => {
    setEditingId(s._id);
    setFormData({ studentId: s.studentId, name: s.name, email: s.email });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ studentId: '', name: '', email: '' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Xác nhận xóa sinh viên này?')) {
      try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (res.ok) {
          alert('Xóa sinh viên thành công!');
          fetchStudents();
        } else {
          alert('Lỗi xóa sinh viên!');
        }
      } catch (err) {
        console.error('Lỗi xóa:', err);
      }
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', maxWidth: '700px' }}>
      <h2>Quản Lý Sinh Viên</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
        <input 
          type="text" 
          placeholder="MSSV" 
          value={formData.studentId} 
          onChange={(e) => setFormData({ ...formData, studentId: e.target.value })} 
          disabled={!!editingId} 
          required 
        />
        <input 
          type="text" 
          placeholder="Họ và tên" 
          value={formData.name} 
          onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
          required 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={formData.email} 
          onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
          required 
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={{ padding: '8px', cursor: 'pointer', flex: 1 }}>
            {editingId ? 'Cập nhật sinh viên' : 'Thêm sinh viên'}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancelEdit} style={{ padding: '8px', cursor: 'pointer' }}>
              Hủy
            </button>
          )}
        </div>
      </form>

      <h3>Danh sách sinh viên</h3>
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>MSSV</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id}>
              <td>{s.studentId}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>
                <button onClick={() => handleEdit(s)} style={{ marginRight: '5px' }}>Sửa</button>
                <button onClick={() => handleDelete(s._id)} style={{ color: 'red' }}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;