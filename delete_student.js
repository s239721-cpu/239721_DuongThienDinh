const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://admin:admin123@cluster0.u8oznzw.mongodb.net/school?retryWrites=true&w=majority";

const studentSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true }
});

const Student = mongoose.model('Student', studentSchema);

async function deleteStudent() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('ĐÃ KẾT NỐI MONGODB ATLAS');

        const targetStudentId = "232121";
        const result = await Student.findOneAndDelete({ studentId: targetStudentId });

        if (result) {
            console.log('XÓA THÀNH CÔNG SINH VIÊN:');
            console.log(result);
        } else {
            console.log('KHÔNG TÌM THẤY SINH VIÊN CÓ ID:', targetStudentId);
        }
    } catch (error) {
        console.log('Lỗi khi xóa:', error.message);
    } finally {
        await mongoose.disconnect();
    }
}

deleteStudent();