var express = require('express');
var router=express.Router();
let mongo=require('mongodb');
let bodyParser=require('body-parser');
let bcrypt=require('bcrypt');
let jwt=require('jsonwebtoken');
let cookieParser=require('cookie-parser');
let mongoClient=mongo.MongoClient;
var ObjectId=require('mongodb').ObjectID;
let dotenv=require('dotenv');
dotenv.config();
let cors=require('cors');
let url=process.env.URL
router.use(cookieParser());
router.use(cors({
    origin:"*"
}))

router.get("/",async function(req,res){
   let token=req.header('token');
   jwt.verify(token, process.env.SECRET,async function(err, decoded) {
       try{
           let taskArray=[];
           let count=0;
        let userEmail=decoded.data;
        let client=await mongoClient.connect(url);
        let db=client.db('aumanager');
        let user=await db.collection('users').findOne({email:userEmail});
        let facultiesEnrolled=user.faculties;
        console.log(facultiesEnrolled.length);
        facultiesEnrolled.forEach(async(element,key,facultiesEnrolled)=> {
            let faculty=await db.collection('users').findOne({_id:ObjectId(element)});
            let allTasks=faculty.tasks;
            let fname=faculty.fname;
            allTasks.forEach((work)=>{
                taskArray.push(work+" (from "+fname+")");
            });
            if(count==(facultiesEnrolled.length-1)){
                res.json(taskArray);
            }
            count++;
        });
       }
       catch(err){
            console.log(err);
       }
  });
});

module.exports=router;