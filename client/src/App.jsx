import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://api-239721.onrender.com';

function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ employeeId: '', fullName: '', email: '', department: '', position: '' });

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/employees`);
      setEmployees(res.data);
    } catch (err) {
      console.error("Lỗi kết nối API:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/employees`, form);
      setForm({ employeeId: '', fullName: '', email: '', department: '', position: '' });
      fetchEmployees();
    } catch (err) {
      alert("Lỗi khi thêm nhân viên!");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Quản Lý Nhân Sự</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <input placeholder="Mã nhân viên" value={form.employeeId} onChange={e => setForm({...form, employeeId: e.target.value})} required />
        <input placeholder="Họ và tên" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} required />
        <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
        <input placeholder="Phòng ban" value={form.department} onChange={e => setForm({...form, department: e.target.value})} />
        <input placeholder="Chức vụ" value={form.position} onChange={e => setForm({...form, position: e.target.value})} />
        <button type="submit">Thêm nhân viên</button>
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
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp._id || emp.employeeId}>
              <td>{emp.employeeId}</td>
              <td>{emp.fullName}</td>
              <td>{emp.email}</td>
              <td>{emp.department}</td>
              <td>{emp.position}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;