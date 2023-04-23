const mongoose = require("mongoose")
const mongoose1 = require("mongoose")
const mongoose2 = require("mongoose")
mongoose1.set("strictQuery", true)
mongoose.set("strictQuery", true)

const conn1 = mongoose.createConnection("mongodb+srv://charlesadmin:admin123@employeemanagementsyste.yckarjq.mongodb.net/CourseData")
const conn2 = mongoose.createConnection("mongodb+srv://charlesadmin:admin123@employeemanagementsyste.yckarjq.mongodb.net/Users")
const conn3 = mongoose1.createConnection("mongodb+srv://charlesadmin:admin123@employeemanagementsyste.yckarjq.mongodb.net/JobOrder")
const conn4 = mongoose2.createConnection("mongodb+srv://charlesadmin:admin123@employeemanagementsyste.yckarjq.mongodb.net/ReviewJobOrder")

// conn1.connect("mongodb+srv://charlesadmin:admin123@employeemanagementsyste.yckarjq.mongodb.net/CourseData")
// .then(()=>{
//     console.log("mongodb connected")
// })
// .catch((err)=>{
//     console.log("failed to connect")
// })

const Schema = new mongoose.Schema({
    user:{
        type:String,
        required: "This Field is Required"
    },
    email:{
        type:String,
        required: "This Field is Required"
    },
    username:{
        type:String,
        required: "This Field is Required"
    },
    name:{
        type:String,
        required: "This Field is Required"
    },
    password:{
        type:String,
        required: "This Field is Required"
    },
    confPass:{
        type:String,
        required: "This Field is Required"
    },
    address:{
        type:String,
        required: "This Field is Required"
    },
    birthday:{
        type:String,
        required: "This Field is Required"
    },
    gender:{
        type:String,
        required: "This Field is Required"
    },
    contactNumber:{
        type:Number,
        required: "This Field is Required"
    },
    zipcode:{
        type:String,
        required: "This Field is Required"
    },
    avatar:{
        type:String,
        required:true
    },
    resume:{
        type:String,
        required:true
    },
    created:{
        type: Date,
        required: false,
        default: Date.now,
    },
}, {versionKey:false})

const JobSchema = new mongoose1.Schema({
    _id:{
        type: String,
        required:true
    },
    name:{
        type: String,
        required:true
    },
    TypeOfWork:{
        type: String,
        required:true
    },
    StartingDate:{
        type: String,
        required:true
    },
    TypeOfJob:{
        type: String,
        required:true
    },
    ExpectedFinishDate:{
        type: Number,
        required:true
    },
    Area:{
        type: String,
        required:true
    },
    Unit:{
        type: String,
        required:true
    },
    Location:{
        type: String,
        required:true
    },
    Comment:{
        type: String,
        required:false,
    },
    JobIncrement:{
        type: Number,
        required:true,
    }
}, {versionKey:false})

//For Validation
function checkUsers(user){
    if(user === "Employee"){
        const tUsers = conn1.model("Employees", Schema)
        return tUsers
    }
    else if(user === "Admin"){
        const tUsers = conn1.model("Admins", Schema)
        return tUsers
    }
    else if(user === "Client"){
        const tUsers = conn1.model("Clients", Schema)
        return tUsers
    }
    else if(user === "Employees"){
        const tUsers = conn2.model("Employees", Schema)
        return tUsers
    }
    else if(user === "Clients"){
        const tUsers = conn2.model("Clients", Schema)
        return tUsers
    }
}

function getEmployee(){
    const employee = conn1.model("Employees", Schema)
    return employee
}

function getAdmin(){
    const admin = conn1.model("Admins", Schema)
    return admin
}

function getClient(){
    const client = conn1.model("Clients", Schema)
    return client
}

//For Users
function getEmployees(){
    const employee = conn2.model("Employees", Schema)
    return employee
}

function getClients(){
    const client = conn2.model("Clients", Schema)
    return client
}

function checkJobs(user){
    if(user === "Employee"){
        const tUsers = conn1.model("Employees", Schema)
        return tUsers
    }}

//For JobOrder
function getJobOrder(){
    const JobOrder = conn3.model("JobOrder", JobSchema)
    return JobOrder
}

//For Verified JobOrder
function getJobOrders(){
    const JobOrders = conn3.model("JobOrders", JobSchema)
    return JobOrders
}

// Custom validation for email
Schema.path("email").validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val)
}, "Invalid E-Mail")

//For Validation
module.exports.getEmployee = getEmployee()
module.exports.getAdmin = getAdmin()
module.exports.getClient = getClient()

//For Users
module.exports.getEmployees = getEmployees()
module.exports.getClients = getClients()


//For JobOrder
module.exports.getJobOrder = getJobOrder()

//For ApprovedJobOrder
module.exports.getJobOrders = getJobOrders()

module.exports.checkUsers = { checkUsers }

module.exports.checkJobs = { checkJobs }

module.exports.mongoose1 = conn1
module.exports.mongoose2 = conn2
module.exports.mongoose3 = conn3

module.exports.mongoose = mongoose

