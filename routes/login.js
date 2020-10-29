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

router.use(bodyParser.json());

router.get('/',function(req,res){
    let token1=req.cookies.jwt;
    console.log(token1);
});


router.post('/',async function(req,res){
    try{
        let client=await mongoClient.connect(url);
        let db=client.db('aumanager');
        let userData=await db.collection('users').findOne({email:req.body.email})
        bcrypt.compare(req.body.pass, userData.pass, function(err, result) {
            if(result == true&&userData.status=="approved"){
                //console.log("Logging in...");
                let token=jwt.sign({
                    data: userData.email
                  }, process.env.SECRET, { expiresIn: '1h' });
                  console.log(token);
                  console.log(`User ${userData.fname} Logged In`);
                  res.json({
                      "token":token,
                      status:1
                  });
            }
        });
    }
    catch(err){
        console.log(err);
    }
});

module.exports=router;
