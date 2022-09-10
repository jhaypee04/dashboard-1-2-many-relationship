const express = require('express')
const ejs = require('ejs')
const mongoose = require('mongoose')

// app
const app = express()

// set view engine
app.set('view engine', 'ejs')

// middlewares
app.use('/assets', express.static('assets'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// handling the get routes
app.get('/', (req, res)=>{
    res.render('index')
})
app.get('/register', (req, res)=>{
    res.render('register')
})
app.get('/login', (req, res)=>{
    res.render('login')
})
app.get('/homepage', (req, res)=>{
    res.render('homepage', { array: ['WDD', 'UI/UX', 'MOS'] })
})
app.get('/dashboard', (req, res)=>{
    res.render('dashboard')
})
app.get('/createNewClassroom', (req, res)=>{
    res.render('createNewClassroom')
})

// handling the post routes
app.post('/register', (req, res)=>{
    const instructorNameFromUI = req.body.instructorName
    const instructorEmailFromUI = req.body.instructorEmail
    const instructorPasswordFromUI = req.body.instructorPassword
    // Persisting to db
    saveToInstructor(instructorNameFromUI,instructorEmailFromUI,instructorPasswordFromUI)
    res.render('homepage', { array: ['WDD', 'UI/UX', 'MOS'] })
})
app.post('/login', (req, res)=>{
    res.render('homepage')
})
app.post('/createNewClassroom', (req, res)=>{
    const classNameFromUI = req.body.className
    const classDaysFromUI = req.body.classDays
    const numberOfWeeksFromUI = req.body.numberOfWeeks
    // Persisting to db
    saveToClassroom(classNameFromUI,classDaysFromUI,numberOfWeeksFromUI)
    res.render('createNewClassroom')
})
app.post('/insertModule', (req, res)=>{
    const weekNoFromUI = req.body.weekNo
    const dayOfModuleFromUI = req.body.dayOfModule
    const titleOfModuleFromUI = req.body.titleOfModule
    // Persisting to db
    saveToWeek(weekNoFromUI,dayOfModuleFromUI,titleOfModuleFromUI)
    res.render('dashboard')
})
app.post('/markAttendance', (req, res)=>{
    const checkedNameFromUI = req.body.checkedName
    const statusFromUI = req.body.status
    const dayOfAttendanceFromUI = req.body.dayOfAttendance
    // Persisting to db
    saveToAttendance(checkedNameFromUI,statusFromUI,dayOfAttendanceFromUI)
    res.render('dashboard')
})
app.post('/insertNewStudent', (req, res)=>{
    const studentNameFromUI = req.body.studentName
    const studentEmailFromUI = req.body.studentEmail
    const parentEmailFromUI = req.body.parentEmail
    const parentPhoneNoFromUI = req.body.parentPhoneNo
    const studentPhoneNoFromUI = req.body.studentPhoneNo
    const genderFromUI = req.body.gender
    const dobFromUI = req.body.dob
    // Persisting to db
    saveToStudent(studentNameFromUI,studentEmailFromUI,parentEmailFromUI,parentPhoneNoFromUI,studentPhoneNoFromUI,genderFromUI,dobFromUI)
    res.render('dashboard')
})

// Listening to db
const port = 3000
app.listen(port,()=>console.log('App connected and listening to port: ', port))

// connecting to mongodb
mongoose.connect('mongodb://127.0.0.1:27017/loctech_attendance_app')
    .then(()=>console.log("connected to db"))
    .catch(err=>console.log('Error: ', err))

// models
const db = require('./model/index')

// create operation
const createInstructor = function(instructor){
    return db.Instructors.create(instructor)
        .then(docInstructors=>{
            console.log("\n>>Created Instructor: \n", docInstructors)
            return docInstructors
        })
}
const createClassroom = function(classroom){
    return db.Classroom.create(classroom)
        .then(docClassroom=>console.log("\>>Created Classroom: ", docClassroom))
}
const createWeek = function(week){
    return db.Weeks.create(week)
        .then(docWeek=>console.log("\n>>Created Week:\n", docWeek))
}
const createAttendance = function(attendance){
    return db.Attendance.create(attendance)
        .then(docAttendance=>console.log("\n>>Created Attendance:\n", docAttendance))
}
const createStudent = function(student){
    return db.Students.create(student)
        .then(docStudent=>console.log("\n>>Created Student:\n", docStudent))
}


    
const saveToInstructor = async function(instructorName,instructorEmail,instructorPassword){
    const Instructor = await createInstructor({
        instructorName,
        instructorEmail,
        instructorPassword,
        classroom: [],
        students: [],
        attendance: []
    })
    console.log("\n>>Created Classroom:\n", Instructor)
    // return Instructor
}
const saveToClassroom = async function(className,classDays,numberOfWeeks){
    var Classroom = await createClassroom({
        className,
        classDays,
        numberOfWeeks,
        weeks: [],
        students: []
    })
    console.log("\n>>Created Classroom:\n", Classroom)
}
const saveToWeek = async function(weekNo,dayOfModule,titleOfModule){
    var Week = await createWeek({
        weekNo,
        dayOfModule,
        titleOfModule
    })
    console.log("\n>>Created Week:\n", Week)
}
const saveToAttendance = async function(checkedName,status,dayOfAttendance){
    var Attendance = await createAttendance({
        checkedName,
        status,
        dayOfAttendance
    })
    console.log("\n>>Created Attendance:\n", Attendance)
}
const saveToStudent = async function(studentName,studentEmail,parentEmail,parentPhoneNo,studentPhoneNo,gender,dob){
    var Student = await createStudent({
        studentName,
        studentEmail,
        parentEmail,
        parentPhoneNo,
        studentPhoneNo,
        gender,
        dob
    })
    console.log("\n>>Created Student:\n", Student)
}

// read operation
// const findInstructor = function(classroomId, classroom){
//     return db.Instructors.findByIdAndUpdate(
//         classroomId,
//         {
//             $push: {
//                 classroom: docClassroom._id
//             }
//         },
//         { new: true, useFindAndModify: false}
//     )
    
// }