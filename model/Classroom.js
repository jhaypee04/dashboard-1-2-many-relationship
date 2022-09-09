const mongoose = require('mongoose')

const Classroom = mongoose.model(
    'classroom',
    new mongoose.Schema({
        className: {
            type: String,
            required: true
        },
        classDays: {
            type: Array,
            required: true
        },
        numberOfWeeks: {
            type: String,
            required: true
        },
        weeks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'weeks'
            }
        ],
        students: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'student'
            }
        ]
    })
)
module.exports = Classroom