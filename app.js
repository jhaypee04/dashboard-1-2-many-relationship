const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const express = require('express')
const ejs = require('ejs')
const mongoose = require('mongoose')

// app
const app = express()

// set view engine
app.set('view engine', 'ejs')

// middlewares
app.use('/assets', express.static('assets'))
app.use(cookieParser())
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
app.get('/homepage', protectRoute, (req, res)=>{
    const InstructorEmailFromPayLoadOfJWT = req.user.instructor.email
    console.log(InstructorEmailFromPayLoadOfJWT)
    res.render('homepage', { array: ['WDD', 'UI/UX', 'MOS'] })
})
app.get('/dashboard', (req, res)=>{
    res.render('dashboard')
})
app.get('/createNewClassroom', (req, res)=>{
    res.render('createNewClassroom')
})
app.get('/logout', (req, res)=>{
    res.clearCookie('token')
    res.redirect('/')
})

// handling the post routes
app.post('/register', async (req, res)=>{
    const instructorNameFromUI = req.body.instructorName
    const instructorEmailFromUI = req.body.instructorEmail
    const instructorPasswordFromUI = req.body.instructorPassword
    // Salting the password
    const saltNo = 10
    const genSalt = await bcrypt.genSalt(saltNo)
    const hashedPassword = await bcrypt.hash(instructorPasswordFromUI, genSalt)
    // Persisting to db
    saveToInstructor(instructorNameFromUI,instructorEmailFromUI,hashedPassword)

    const token = await makeToken(instructorEmailFromUI)
    console.log(token)
    // make httpOnly:true later
    res.cookie('token', token, {httpOnly: false})
    res.render('homepage', { array: ['WDD', 'UI/UX', 'MOS'] })
})
app.post('/login', (req, res)=>{
    const instructorEmailFromUI = req.body.instructorEmail
    const instructorPasswordFromUI = req.body.instructorPassword
    console.log(instructorEmailFromUI,instructorPasswordFromUI)
    res.render('homepage', { array: ['WDD', 'UI/UX', 'MOS'] })
})
app.post('/createNewClassroom', protectRoute, async (req, res)=>{
    const classNameFromUI = req.body.className
    const classDaysFromUI = req.body.classDays
    const numberOfWeeksFromUI = req.body.numberOfWeeks
    // Email from payload of JWT
    const InstructorEmailFromPayLoadOfJWT = req.user.instructor.email
    console.log(InstructorEmailFromPayLoadOfJWT)
    
    // Reading from db
    
    // const Email = getInstructorEmail(InstructorEmailFromPayLoadOfJWT)

    // Persisting to db
    const SavedClassroom = await saveToClassroom(classNameFromUI,classDaysFromUI,numberOfWeeksFromUI)
    const classroomId = SavedClassroom._id
    const refName = "classroom"
    option = {classroom: classroomId}

    findInstructorAndUpdate(InstructorEmailFromPayLoadOfJWT, option)
    // console.log("Classroom in app.post: " + Classroom, " Instructor Email: " +InstructorEmailFromPayLoadOfJWT)

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

// jwt
const secretKey = 'Thisisatest'
async function makeToken(emailFromUI){
    const payload = {
        instructor: {
            email: emailFromUI
        }
    }
    const token = await jwt.sign(payload,secretKey,{expiresIn: '3600s'})
    return token
}

// protecting routes
function protectRoute(req, res, next){
    const token = req.cookies.token
    // console.log(`Token: ${req.cookies.token}`)
    try{
        req.user = jwt.verify(token,secretKey)
        // const instructorEmail =  req.user.instructor.email
        // console.log(instructorEmail)
        next()
    }
    catch(err){
        res.clearCookie('token')
        return res.redirect('/')
        console.log('Error: ', err)
    }
}


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
        .then(docClassroom=>docClassroom)
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
    console.log("\n>>Created Instructor:\n", Instructor)
    // findInstructor(Instructor._id)
    // delete below if using above
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
    console.log("\n>>saved to Classroom:\n", Classroom)
    return Classroom
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

function findInstructorAndUpdate(email, object){
    // console.log(`Email from app.post: ${email}, Classroom from app.post: ${object.classroom}. Outside app.post`)
    db.Instructors.findOne({instructorEmail: email})
        .then((docInstructor)=>{
            // console.log("docInstructor" + docInstructor)
            const InstructorId = docInstructor._id
            // // const ClassroomId = classroom._id
            // console.log("InstructorId: "+`ObjectId(${InstructorId})`)
            // console.log("Classroom ID: "+ `ObjectId(${object.classroom})`)
            db.Instructors.findByIdAndUpdate(
                InstructorId,
                { $push: object},
                { new: true, useFindAndModify: false },
                function(err){
                    if(err){
                        console.log("Update Error: ", err)
                    }
                    else{
                        console.log("Update Success")
                    }
                }
            )
        })
}
