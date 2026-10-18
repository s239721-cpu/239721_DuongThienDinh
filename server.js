global.crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(null, true); // Hoặc truyền origin cụ thể
    }
  },
  credentials: true
}));

app.use(express.json());

// Sử dụng biến môi trường MONGODB_URI (hoặc chuỗi mặc định nếu chạy local)
const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://admin:admin123@cluster0.u8oznzw.mongodb.net/school?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log('Backend kết nối Atlas thành công!'))
  .catch(err => console.error('Lỗi Atlas:', err));

const studentSchema = new mongoose.Schema({
  studentId: String,
  name: String,
  email: String
});

const Student = mongoose.model('Student', studentSchema);

// 1. Lấy danh sách
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Thêm sinh viên
app.post('/api/students', async (req, res) => {
  try {
    const { studentId, mssv, name, email } = req.body;
    const newStudent = new Student({
      studentId: studentId || mssv,
      name,
      email
    });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. CẬP NHẬT SINH VIÊN
app.put('/api/students/:id', async (req, res) => {
  try {
    const { name, email } = req.body;
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true }
    );
    if (!updatedStudent) {
      return res.status(404).json({ error: 'Không tìm thấy sinh viên!' });
    }
    res.json(updatedStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. XÓA SINH VIÊN
app.delete('/api/students/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ error: 'Không tìm thấy sinh viên!' });
    }
    res.json({ message: 'Xóa sinh viên thành công!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy port ${PORT}`);
});