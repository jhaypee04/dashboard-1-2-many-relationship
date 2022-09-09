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
    res.render('homepage', { array: ['WDD', 'UI/UX', 'MOS'] })
})
app.post('/login', (req, res)=>{
    res.render('homepage')
})
app.post('/createNewClassroom', (req, res)=>{
    res.render('createNewClassroom')
})
app.post('/insertModule', (req, res)=>{
    console.log(req.body)
    res.render('dashboard')
})
app.post('/markAttendance', (req, res)=>{
    console.log(req.body)
    res.render('dashboard')
})
app.post('/insertNewStudent', (req, res)=>{
    console.log(req.body)
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

const createInstructor = function(instructor){
    return db.Instructors.create(instructor)
        .then(docInstructors=>{
            console.log("\n>>Created Instructor: \n", docInstructors)
            return docInstructors
        })
}
const createClassroom = function(classroomId, classroom){
    return db.Classroom.create(classroom)
        .then(docClassroom=>{
            return db.Instructors.findByIdAndUpdate(
                classroomId,
                {
                    $push: {
                        classroom: docClassroom._id
                    }
                },
                { new: true, useFindAndModify: false}
            )
        })
}

const run = async function(){
    var Instructor = await createInstructor({
        classroom: [],
        students: [],
        attendance: [],
    })
    Instructor = await createClassroom(Instructor._id, {
        className: "Web Design and Development"
    })
    console.log("\n>>Created Classroom:\n", Instructor)
}

// run()