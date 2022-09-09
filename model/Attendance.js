const mongoose = require('mongoose')

const Attendance = mongoose.model(
    'attendance',
    new mongoose.Schema({
        classroom: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'classroom'
            }
        ]
    })
)
module.exports = Attendance