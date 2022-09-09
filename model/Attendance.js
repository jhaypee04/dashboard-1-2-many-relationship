const mongoose = require('mongoose')

const Attendance = mongoose.model(
    'attendance',
    new mongoose.Schema({
        checkedName: {
            type: Array,
            required: true
        },
        status: {
            type: bool,
            required: true
        },
        dayOfAttendance: {
            type: String,
            required: true
        },
        classroom: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'classroom'
            }
        ]
    })
)
module.exports = Attendance