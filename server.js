global.crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: '*', // Cho phép Frontend gọi API không bị chặn CORS
  credentials: true
}));

app.use(express.json());

// Kết nối MongoDB Atlas (Đã tự động định tuyến tới database 239721_DuongThienDinh)
const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://admin:239721@cluster0.u8oznzw.mongodb.net/239721_DuongThienDinh?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log('Backend kết nối Atlas thành công!'))
  .catch(err => console.error('Lỗi Atlas:', err));

// Schema Nhân viên chuẩn theo yêu cầu đề thi
const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  department: String,
  position: String
}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);

// Endpoint kiểm tra trạng thái Backend (Health Check - Câu 3)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend Quản lý nhân sự đang chạy!' });
});

// 1. Lấy danh sách nhân viên + Tìm kiếm theo mã NV hoặc Họ tên (GET /api/employees?search=...)
app.get('/api/employees', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { employeeId: { $regex: search,$options: 'i' } },
          { fullName: { $regex: search,$options: 'i' } }
        ]
      };
    }
    const employees = await Employee.find(query);
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Lấy thông tin 1 nhân viên theo ID (GET /api/employees/:id)
app.get('/api/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Không tìm thấy nhân viên!' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Thêm nhân viên mới (POST /api/employees)
app.post('/api/employees', async (req, res) => {
  try {
    const { employeeId, fullName, email, department, position } = req.body;
    
    // Kiểm tra dữ liệu bắt buộc
    if (!employeeId || !fullName || !email) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ Mã nhân viên, Họ tên và Email!' });
    }

    // Kiểm tra trùng mã nhân viên
    const existingEmp = await Employee.findOne({ employeeId });
    if (existingEmp) {
      return res.status(400).json({ error: 'Mã nhân viên đã tồn tại!' });
    }

    const newEmployee = new Employee({ employeeId, fullName, email, department, position });
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Cập nhật thông tin nhân viên (PUT /api/employees/:id)
app.put('/api/employees/:id', async (req, res) => {
  try {
    const { fullName, email, department, position } = req.body;
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { fullName, email, department, position },
      { new: true, runValidators: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ error: 'Không tìm thấy nhân viên!' });
    }
    res.json(updatedEmployee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Xóa nhân viên (DELETE /api/employees/:id)
app.delete('/api/employees/:id', async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ error: 'Không tìm thấy nhân viên!' });
    }
    res.json({ message: 'Xóa nhân viên thành công!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000