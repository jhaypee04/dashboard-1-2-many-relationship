const mongoose = require('mongoose')

const Classroom = mongoose.model(
    'classroom',
    new mongoose.Schema({
        className: {
            type: String,
            required: true
        },
        classDays: {
            type: String,
            required: true
        },
        numberOfWeeks: {
            type: String,
            required: true
        },
        weekNo: {
            type: String,
            required: true
        },
        dayOfModule: {
            type: String,
            required: true
        },
        titleOfModule: {
            type: String,
            required: true
        },
        students: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'student'
            }
        ]
    })
)
module.exports = Classroom