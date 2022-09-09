const mongoose = require('mongoose')

const Instructors = mongoose.model(
    'instructor',
    new mongoose.Schema({
        instructorName: {
            type: String,
            required: true
        },
        instructorEmail: {
            type: String,
            required: true
        },
        instructorPassword: {
            type: String,
            required: true
        },
        classroom: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'classroom'
            }
        ],
        students: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'student'
            }
        ],
        attendance: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'attendance'
            }
        ],
    })
)
module.exports = Instructors
