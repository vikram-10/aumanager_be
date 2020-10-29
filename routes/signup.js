var express = require('express');
const { route } = require('.');
var router = express.Router();
var mongo=require('mongodb');
var dotenv=require('dotenv');
var bodyParser=require('body-parser');
let cors=require('cors');
let bcrypt=require('bcrypt');
let saltRounds=10;
dotenv.config();
let mongoClient=mongo.MongoClient;
let url=process.env.URL;

router.use(cors({
    origin:"*"
}));

router.use(bodyParser.json());

/* GET Signup page. */
router.get('/', function(req, res, next) {
    res.send("Hello to Signup Get route")
  });


// POST Signup Page  

router.post("/",async function(req,res){
    try{
        bcrypt.hash(req.body.pass, saltRounds, function(err, hash) {
            req.body.pass=hash;
        });
        let client=await mongoClient.connect(url);
        console.log("Client connected!");
        let db=client.db('aumanager');
        console.log("DB connected!");
        db.collection('users').insertOne(req.body);
        client.close();
        res.json({
            status: 1
        });
    }
    catch(err){

    }
  });
  
  module.exports = router;