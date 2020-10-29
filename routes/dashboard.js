var express = require('express');
var router=express.Router();
let mongo=require('mongodb');
let bodyParser=require('body-parser');
let bcrypt=require('bcrypt');
let jwt=require('jsonwebtoken');
let cookieParser=require('cookie-parser');
let mongoClient=mongo.MongoClient;
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
        let userEmail=decoded.data;
        let client=await mongoClient.connect(url);
        let db=client.db('aumanager');
        let user=await db.collection('users').findOne({email:userEmail});
        res.json(user); 
       }
       catch(err){
            console.log(err);
       }
  });
});

router.post("/",function(req,res){

});

module.exports=router;