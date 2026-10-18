global.crypto = require('crypto');
const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://admin:admin123@cluster0.u8oznzw.mongodb.net/school?retryWrites=true&w=majority";

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true }
});

const Student = mongoose.model('Student', studentSchema);

async function updateStudent() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('= ĐÃ KẾT NỐI MONGODB ATLAS =');

    const targetStudentId = "232121"; // Mã sinh viên cần cập nhật

    const updatedData = {
      name: "Le H long Long",
      email: "long21@gmail.com"
    };

    // upsert: true -> Tự tạo mới nếu chưa tìm thấy SV01
    // returnDocument: 'after' -> Sửa lỗi Warning của Mongoose
    const result = await Student.findOneAndUpdate(
      { studentId: targetStudentId },
      updatedData,
      { returnDocument: 'after', upsert: true }
    );

    console.log(' CẬP NHẬT / TẠO MỚI THÀNH CÔNG:');
    console.log(result);
  } catch (err) {
    console.error('Lỗi khi cập nhật:', err.message);
  } finally {
    await mongoose.connection.close();
  }
}

updateStudent();