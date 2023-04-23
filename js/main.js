const express = require("express")
const app = express()
const hbs = require("hbs")
const path = require("path")
const mongodb = require("./mongodb")
const templatePath = path.join(__dirname, "../HTML")
const multer = require("multer")
const cloudinary = require("./cloudinary")
const dataCheck = require("./dataCheck")
const url = require("url")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const bcrypt = require('bcrypt');


app.use(express.static("HTML"))
app.use(express.static("."))
app.use(express.json())
app.use(cookieParser())
app.set("view engine", "hbs", "ejs")
app.set("views", templatePath)
app.use(express.urlencoded({extended:false}))

app.get("/", (req,res) => {
    res.render("LOCALS/PortalPage")
})

app.get("/MachineLearningForm", authenticateToken, (req,res) => {
    mongodb.getJobOrder.find((err, docs) => {
        if(!err){
            res.render("LOCALS/MachineLearningForm", {list: docs, user:req.user})
        }
    })
})

app.get("/Settings", (req,res) => {
    res.render("LOCALS/Settings", {user:req.user})
})



    
app.post("/Settings", async (req, res) => {
        const input = {
            name:req.body.name,
            id:req.body.id,
            user:req.body.user,
            password:req.body.password,
            email:req.body.email
        }
        console.log(input)
    const UserID = req.params._id;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
      // Get the user's data from the database
      const cli = await mongodb.getClients.findOne({UserID});
      const user = cli
      console.log(user)
              // Check if the old password is correct
      const passwordMatch = await bcrypt.compare(oldPassword, user.password);
      console.log(oldPassword)
      console.log(user.password)
      if (!passwordMatch) {
        res.status(401).send('Invalid old password');
        return;
      }
      // Generate a hash of the new password using bcrypt
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      // Update the user's password in the database
      mongodb.getClients.findOneAndUpdate(UserID, { password: hashedPassword }, (err, user) => {
        if (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
        } else {
          res.render("LOCALS/LoginPage");
        }
      });
});

app.get("/JobOrder", authenticateToken, (req,res) => {
    res.render("LOCALS/JobOrder")
})

app.get("/Notification", (req,res) => {
    res.render("Notification")
})

app.post("/JobOrderLink", authenticateToken, (req,res) => {
    const user = {
        name:req.body.name,
        id:req.body.id
    }
    res.render("LOCALS/JobOrder", {user})
})

app.get("/schedule", authenticateToken, (req,res) => {
    res.render("LOCALS/schedule")
})

app.post("/logout", (req,res) => {
    if(req.cookies.jwt){
        res.clearCookie("jwt")
        res.clearCookie("user")
        res.send({ success: true });
    }
})

const getCurrentJobIncrement = async () => {
    const jobOrder = await mongodb.getJobOrder.findOne().sort({ _id: -1 }).limit(1);
    if (jobOrder) {
        return jobOrder.JobIncrement;
    } else {
        return 0;
    }
}

app.get("/api/getname", (req, res) => {
    db.collection("users").findOne({}, (err, result) => {
      if (err) throw err;
      res.json({ name: result.name });
    });
  });

app.post("/JobOrder", authenticateToken, async (req,res) => {
    try{
        const jobIncrement = await getCurrentJobIncrement() + 1;
        const data = {
            _id:req.body.id,
            name:req.body.name,
            TypeOfWork:req.body.TypeOfWork,
            TypeOfJob: req.body.TypeOfJob,
            StartingDate:req.body.StartingDate,
            ExpectedFinishDate:req.body.ExpectedFinishDate,
            Area:req.body.Area,
            Unit:req.body.Unit,
            Location:req.body.Location,
            JobIncrement: jobIncrement,
        }
        mongodb.getJobOrder.insertMany([data], async (err) => {
            if(!err){
                const jobIncrement = await getCurrentJobIncrement() + 1;
                await mongodb.getJobOrder.updateOne(
                    { JobIncrement: jobIncrement - 1 },
                    { $set: { JobIncrement: jobIncrement } }
                );
                res.render("LOCALS/ClientInterface");
            }
            else{
                res.send(err);
            }
        })
    } catch(error){
        res.send(error)
    }
})


app.get("/portalpage", (req,res) => {
    res.render("LOCALS/portalpage")
})

app.get("/loginpage", (req,res) => {
    res.render("LOCALS/loginpage")
})

app.get("/signuppage", (req,res) => {
    res.render("LOCALS/signuppage")
})

app.get("/homepage", authenticateToken, (req, res) => {
    res.render("LOCALS/homepage")
})

app.get("/RecommendedWorker", authenticateToken, (req,res) => {
    res.render("LOCALS/RecommendedWorker")
})

app.get("/clientsDB", authenticateToken, (req,res) => {
    mongodb.getClient.find((err, docs) => {
        if(!err){
            res.render("USERS/ClientDatabase", {list: docs})
        }
    })
})

app.get("/jobsPending", authenticateToken, (req,res) => {
    mongodb.getJobOrder.find((err, docs) => {
        if(!err){
            res.render("LOCALS/Joblist", {list: docs})
        }
    })
})



app.get("/OrderedList", authenticateToken, (req,res) => {
    console.log(req.body.name)
})

app.get("/employeesDB", authenticateToken, (req,res) => {hbs.registerHelper('cloudinaryUrl', (publicId, options) => {
    const format = options.hash.format || 'jpg';
    const url = cloudinary.url(publicId, { format: format });
    return url;
  });
    mongodb.getEmployee.find((err, docs) => {
        if(!err){
            res.render("USERS/EmployeeDatabase", {list: docs})
            
        }
    })
})

app.get("/AdminInterface", authenticateToken, (req,res) => {
    if(req.user.user === "Admin") res.render("LOCALS/AdminInterface", {user:req.user})
    else res.sendStatus(401)
})

app.post("/AdminInterface", authenticateToken, (req,res) => {
    if(req.user.user === "Admin") res.render("LOCALS/AdminInterface", {user:req.user})
    else res.sendStatus(401)
})

app.get("/EmployeeInterface", authenticateToken, (req,res) => {
    if(req.user.user === "Employee") res.render("LOCALS/EmployeeInterface", {user:req.user})
    else res.sendStatus(401)
})

app.post("/EmployeeInterface", authenticateToken, (req,res) => {
    if(req.user.user === "Employee") res.render("LOCALS/EmployeeInterface", {user:req.user})
    else res.sendStatus(401)
})

app.get("/ClientInterface", authenticateToken, (req,res) => {
    if(req.user.user === "Client") res.render("LOCALS/ClientInterface", {user:req.user})
    else res.sendStatus(401)
})

app.post("/ClientInterface", authenticateToken, (req,res) => {
    if(req.user.user === "Client") res.render("LOCALS/ClientInterface", {user:req.user})
    else res.sendStatus(401)
})

app.post("/interface", authenticateToken, (req, res) => {
    if(req.user.user === "Admin"){
        res.json({ success:true, user:req.user.user })
    } else if(req.user.user === "Employee"){
        res.json({ success:true, user:req.user.user })
    } else{
        res.json({ success:true, user:req.user.user })
    }
})

app.get(":path", (req, res) => {
    url(req.params.path)
})

app.get("/interface/:user/:id",async (req, res) => {
    const check = await dataCheck.getData.getData(req.params.user, req.params.id)
    console.log(check)
    res.render("USERS/"+ req.params.user, {check})
})

app.get("/delete/:id/:user", (req, res) => {
    mongodb.checkUsers.checkUsers(req.params.user).findByIdAndRemove(req.params.id, (err) => {
        if(!err){
            res.redirect("/" + req.params.user + "Database")
        }
        else{ 
            console.log("Failed to Delete Details: " + err)
        }
    })
})

app.get("/accept/:id/:user", async (req, res) => {
    const id = (req.params.id)
    const user = (req.params.user + "s")
    const data1 = await mongodb.checkUsers.checkUsers(req.params.user).findById(id)
    mongodb.checkUsers.checkUsers(user).insertMany([data1],async (err) => {
        if(!err){
            await mongodb.checkUsers.checkUsers(req.params.user).findByIdAndRemove(id)
            res.redirect("/" + req.params.user + "Database")
        }
        else{
            res.send("May Mali")
        }
    })
})

app.get("/accept/:id/:user",async (req, res) => {
    const id = (req.params.id)
    const data1 = await mongodb.getJobOrder.checkJob(id).findById(id)
    mongodb.checkJobs.checkJob(id).insertMany([data1],async (err) => {
        if(!err){
            await mongodb.checkJobs.checkJob(id).findByIdAndRemove(id)
            res.redirect("/" + req.params.user + "Database")
        }
        else{
            res.send("May Mali")
        }
    })
})

const storage =  multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "resume")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage})

async function uploadImage(images){
    try{
        const avatar = await cloudinary.key.uploader.upload(images.avatar, {
            folder: "Avatar"
        })
        const resume = await cloudinary.key.uploader.upload(images.resume, {
            folder: "Resume"
        })

        const data2 = {
            avatar:avatar.secure_url,
            cloudinary_id1:avatar.public_id,
            resume:resume.secure_url,
            cloudinary_id2:resume.public_id
        }
        return data2
    } catch{
        res.sendStatus(500)
    }
}

app.post("/save-review", authenticateToken, async (req,res) => {
    const review = req.body.review
})

app.post("/check-email", authenticateToken, async (req, res) => {
        const email = req.body.email
        const eEmployee = await mongodb.getEmployee.findOne({ email })
        const eEmployees = await mongodb.getEmployees.findOne({ email })
        const eClient = await mongodb.getClient.findOne({ email })
        const eClients = await mongodb.getClients.findOne({ email })

        if(eEmployee !== null || eClient !== null || eEmployees !== null || eClients !== null){
            const exists = !!true
            res.json({ exists })
        } else{
            const exists = !!false
            res.json({ exists })
        }
})

app.post("/check-username", authenticateToken, async (req, res) => {
    const username = req.body.username
    const uEmployee = await mongodb.getEmployee.findOne({ username })
    const uEmployees = await mongodb.getEmployees.findOne({ username })
    const uClient = await mongodb.getClient.findOne({ username })
    const uClients = await mongodb.getClients.findOne({ username })

    if(uEmployee !== null || uClient !== null || uEmployees !== null || uClients !== null){
        const exists = !!true
        res.json({ exists })
    } else{
        const exists = !!false
        res.json({ exists })
    }
})

app.post("/signuppage", upload.fields([
    { name: "images", maxCounts: 1},
    { name: "image", maxCounts: 1}]),
    async (req, res) => {
        try{
            const securedPassowrd = 10; // increase this for more secure hashing
            const hashedPassword = await bcrypt.hash(req.body.password, securedPassowrd);
            const data1 = {
                user:req.body.user,
                email:req.body.email,
                username:req.body.username,
                name:req.body.name,
                confPass:hashedPassword,
                contactNumber:hashedPassword,
                password:req.body.password,
                address:(req.body.address1 + ", " + req.body.address2 + ", " + req.body.address3 + ", " + req.body.address4),
                birthday:req.body.birthday,
                zipcode:req.body.zipcode,
                gender:req.body.gender,
            }

            const images = {
                avatar:req.files["images"][0].path,
                resume:req.files["image"][0].path
            }
            const data2 = await uploadImage(images)
            const data = Object.assign({}, data1, data2)
            mongodb.checkUsers.checkUsers(req.body.user).insertMany([data], (err) => {
                if(!err){
                    res.render("LOCALS/loginpage")
                } else if(err){
                    res.status(404)
                    // console.log(err.message)
                    // if(err.name === "ValidationError"){
                    //     handleValidationError(err, req.body)
                    //     res.render("LOCALS/signuppage",{data1:req.body})
                    // }
                }
            })
        } catch{
            res.sendStatus(404)
        }
})

app.post("/check-data", authenticateToken, async (req, res) => {
    const input = {
        name:req.body.name,
        password:req.body.password
    }
    console.log(input.name)
    console.log(input.password)

    const adm = await dataCheck.adminData.adminData(req.body.name)
    const emp = await dataCheck.employeeData.employeeData(req.body.name)
    const cli = await dataCheck.clientData.clientData(req.body.name)
    const user = adm || emp || cli || undefined

    if(input.name === "" && input.password === ""){
        const error = "Please enter your Username/Email and Password."
        const validity = !!true
        
        res.json({error:error, validity:validity})
    } else if(input.name !== null && input.password === ""){
        const error = "Please enter your Password."
        
    } else if(input.name === "" && input.password !== null){
        const error = "Please enter your Username/Password."
  
    } else if(user === undefined && (req.body.name !== null && req.body.password !== null)){
        const error = "Invalid Account."
        
    } else if((user.username === req.body.name || user.email === req.body.name) && user.password === req.body.password){ 
        const validity = !!false
        console.log(validity)
        res.json({validity})
    } else{
        const error = ("Wrong Email/Username or Password!")
        
    }
})

app.post("/loginpage",async (req, res) => {
    const input = {
        name:req.body.name,
        password:req.body.password
    }

    const secret_key = "c1b9e493ae98131ea822664641c0a08ec53639a0e9ea536de61fad222d7ab6d3684c0b15e61425247d9f42773b32867e967d4d78f96955b0c2805c538d10da10"

    const adm = await dataCheck.adminData.adminData(req.body.name)
    const emp = await dataCheck.employeeData.employeeData(req.body.name)
    const cli = await dataCheck.clientData.clientData(req.body.name)
    const user = adm || emp || cli || undefined
    
    if(input.name === "" && input.password === ""){
        const error = "Please enter your Username/Email and Password."
        res.json({error, success:false})
    } else if(input.name !== null && input.password === ""){
        const error = "Please enter your Password."
        res.json({error, success:false})
    } else if(input.name === "" && input.password !== null){
        const error = "Please enter your Username/Password."
        res.json({error, success:false})
    } else if(user === undefined && (req.body.name !== null && req.body.password !== null)){
        const error = "Invalid Account."
        res.json({error, success:false})
    } else if((user.username === req.body.name || user.email === req.body.name) && (await bcrypt.compare(input.password, user.password) ||  user.password === req.body.password )){ 
        const token = jwt.sign({ userId: user.id }, secret_key, { expiresIn: "1h"})
        res.cookie("jwt", token, { httpOnly: true, secure: true })
        res.json({success:true})
    } else{
        const error = ("Wrong Email/Username or Password!")
        res.json({error, success:false})
    }
})

function authenticateToken(req, res, next) {
    const token = req.cookies.jwt;

    const secret_key = "c1b9e493ae98131ea822664641c0a08ec53639a0e9ea536de61fad222d7ab6d3684c0b15e61425247d9f42773b32867e967d4d78f96955b0c2805c538d10da10"

    if(token){
      jwt.verify(token, secret_key,async (err, decoded) => {
        if(err){
          res.status(401).send({ success: false, message: "Invalid Token" });
        } else{
            const adm = await mongodb.getAdmin.findOne({_id:decoded.userId})
            const emp = await mongodb.getEmployees.findOne({_id:decoded.userId})
            const cli = await mongodb.getClients.findOne({_id:decoded.userId})
            const user = adm || emp || cli || undefined
            req.user = user;
            next();
        }
      });
    } else{
      res.status(401).send({ success: false, message: "Missing Token" });
    }
}

// function handleValidationError(err, body){
//     for (field in err.errors) {
//         switch (err.errors[field].path){
//             case "name":
//                 body["fullNameError"] = err.errors[field].message;
//                 break;
//             case "email":
//                 body["emailError"] = err.errors[field].message;
//                 break;
//             case "username":
//                 body["usernameError"] = err.errors[field].message;
//                 break;
//             case "contactNumber":
//                 body["cnError"] = err.errors[field].message;
//                 break;
//             case "age":
//                 body["ageError"] = err.errors[field].message;
//                 break;
//             case "gender":
//                 body["genderError"] = err.errors[field].message;
//                 break;
//             case "birthday":
//                 body["bdError"] = err.errors[field].message;
//                 break;
//             case "password":
//                 body["passError"] = err.errors[field].message;
//                 break;
//             case "confPass":
//                 body["confpassError"] = err.errors[field].message;
//                 break;
//             case "address":
//                 body["addressError"] = err.errors[field].message;
//                 break;
//             case "zipcode":
//                 body["zipError"] = err.errors[field].message;
//                 break;
//             default:
//                 break;
//         }
//     }
// }

const port = 3000;
app.listen(port, () => {
    console.log("Port is Connected: " + port)
})