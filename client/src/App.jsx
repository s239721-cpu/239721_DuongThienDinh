import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://api-239721.onrender.com/api/employees';

function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ employeeId: '', name: '', email: '', department: '', position: '' });
  const [editId, setEditId] = useState(null);

  // Load danh sách
  const fetchEmployees = async () => {
    const res = await axios.get(API_URL);
    setEmployees(res.data);
  };

  useEffect(() => { fetchEmployees(); }, []);

  // Thêm hoặc Cập nhật
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`${API_URL}/${editId}`, form);
      setEditId(null);
    } else {
      await axios.post(API_URL, form);
    }
    setForm({ employeeId: '', name: '', email: '', department: '', position: '' });
    fetchEmployees();
  };

  // Xóa nhân viên
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa?')) {
      await axios.delete(`${API_URL}/${id}`);
      fetchEmployees();
    }
  };

  // Chọn nhân viên để sửa
  const handleEdit = (emp) => {
    setEditId(emp._id);
    setForm(emp);
  };

  // Lọc tìm kiếm
  const filteredEmployees = employees.filter(emp =>
    emp.name?.toLowerCase().includes(search.toLowerCase()) ||
    emp.employeeId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h2>Quản Lý Nhân Sự</h2>
      
      {/* Ô tìm kiếm */}
      <input 
        type="text" 
        placeholder="Tìm kiếm theo tên hoặc mã NV..." 
        value={search} 
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '15px' }}
      />

      {/* Form Thêm/Sửa */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
        <input placeholder="Mã nhân viên" value={form.employeeId} onChange={e => setForm({...form, employeeId: e.target.value})} required />
        <input placeholder="Họ và tên" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
        <input placeholder="Phòng ban" value={form.department} onChange={e => setForm({...form, department: e.target.value})} />
        <input placeholder="Chức vụ" value={form.position} onChange={e => setForm({...form, position: e.target.value})} />
        <button type="submit">{editId ? 'Cập nhật nhân viên' : 'Thêm nhân viên'}</button>
      </form>

      <h3>Danh sách nhân viên</h3>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Mã NV</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Phòng ban</th>
            <th>Chức vụ</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map(emp => (
            <tr key={emp._id}>
              <td>{emp.employeeId}</td>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.department}</td>
              <td>{emp.position}</td>
              <td>
                <button onClick={() => handleEdit(emp)}>Sửa</button>
                <button onClick={() => handleDelete(emp._id)} style={{ color: 'red', marginLeft: '5px' }}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;