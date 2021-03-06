var express = require('express');
var router=express.Router();
let mongo=require('mongodb');
let bodyParser=require('body-parser');
let bcrypt=require('bcrypt');
let jwt=require('jsonwebtoken');
let cookieParser=require('cookie-parser');
let mongoClient=mongo.MongoClient;
let ObjectId=require('mongodb').ObjectID;
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
        let facultyEmails=[];
           let count=0;
        let userEmail=decoded.data;
        let client=await mongoClient.connect(url);
        let db=client.db('aumanager');
        let userDoubts=await db.collection('doubts').find({from:userEmail}).toArray();
        let user=await db.collection('users').findOne({email:userEmail});
        let facultiesEnrolled=user.faculties;
        //console.log(facultiesEnrolled);
        facultiesEnrolled.forEach(async(element) => {
            try{
                let faculty=await db.collection('users').findOne({_id:ObjectId(element)});
                console.log(faculty.email);
                facultyEmails.push(faculty.email);
                if(count==(facultiesEnrolled.length)-1){
                    console.log(user.doubts);
                    let data=[{
                        "facultyEmails":facultyEmails,
                        "studentDoubts":userDoubts
                    }];
                    console.log(data);
                res.json(data);
                }
                count++;
            }
            catch(err){
                console.log(err);
            }
        });
       }
       catch(err){
            console.log(err);
       }
  });
});


router.post("/",async function(req,res){
    let token=req.header('token');
    jwt.verify(token, process.env.SECRET,async function(err, decoded) {
        try{
         let userEmail=decoded.data;
         let insertInDoubts={
             "to":req.body.to,
             "from":userEmail,
             "doubtTitle":req.body.doubtTitle,
             "detailedDoubt":req.body.detailedDoubt,
             "status":req.body.status
         };
         console.log(insertInDoubts);
         let insertInStudentDb=req.body;
         let client=await mongoClient.connect(url);
         let db=client.db('aumanager');
         let doubtsUpdate=await db.collection('doubts').insertOne(insertInDoubts);
         res.json({
             status:1
         });
        }
        catch(err){
             console.log(err);
        }
   });
 });
 

module.exports=router;