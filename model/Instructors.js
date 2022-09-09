const mongoose = require('mongoose')

const Instructors = mongoose.model(
    'instructor',
    new mongoose.Schema({
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
