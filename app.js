
var express = require('express');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var objectid = require('objectid')
const crypto = require('crypto');
var nodemailer = require('nodemailer');
var nodeoutlook = require('nodejs-nodemailer-outlook')
var app = express();
var os = require('os');
var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions)); 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


function  cryptoHash() {
  const hash = 'ravi';
  var hashlogin = crypto.createHash('md5').update(hash).digest('hex');
  console.log(hashlogin);
  }

// Get List Call
app.get("/myobjData",(req,res)=>{
  const hash = 'ravi';
  var hashlogin = crypto.createHash('md5').update(hash).digest('hex');
  console.log(hashlogin);
  
  MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
    const dbo = db.db("mydb");

    dbo.collection("customers").find({}).toArray((err,docs)=>{
      err => {
        res.send({Success: false, data: 'Exception Occured'})
      }
      res.send({Success: true,  data:docs})
    })
  })
})

// Get Call By Id
app.get('jkhdahjh/:id', function(req, res) {
  MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
    const dbo = db.db("mydb");
    dbo.collection("customers").find({_id: objectid(req.params.id)}).toArray((err,docs)=>{
      err => {
        res.send({'Success': false, 'data': 'Exception Occured'})
      }
  
      res.send({'Success': true,  'data':docs})
    })
  })
});

// post inserting object 

app.post('/insertemployees', function(req, res)  {
  
  MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
    if(err){
      console.log(err);
    }else{
     var dbo = db.db("mydb");
    console.log(req.body);
    dbo.collection("employees").insert(req.body, function(err, docs) {
      if(err)     console.log("err",err);
       console.log("Number of documents inserted: " + JSON.stringify(docs));
       res.send({'Success': true,  'data': docs.ops[0] })
    });
  }
  });

});
app.post('/insertcustomers', function(req, res)  {
  
  MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
    if(err){
      console.log(err);
      
    }else{
     var dbo = db.db("mydb");
    // var myobj = [
    //   { name: 'krs', password: '123456'},
    //   {name: 'rsk', address: '456987'},
    // //  {_id: 3537, name: 'Amy', address: 'Apple st 652'},
    //   //{_id: 3538, name: 'Hannah', address: 'Mountain 21'},
    //   //{_id: 3539, name: 'Michael', address: 'Valley 345'},
    // ];
    console.log(req.body);
    if(req.body.mode === 'A') {
      dbo.collection("customers").insert(req.body, function(err, docs) {
        if(err)     console.log("err",err);
         console.log("Number of documents inserted: " + JSON.stringify(docs));
         res.send({'Success': true,  'data': docs.ops[0] })
      });
    } else {
      MongoClient.connect(url,{useNewUrlParser: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var newvalues = { $set: { name: req.body.name, address: req.body.address} };
        console.log(req.body);
        dbo.collection("customers").updateOne({_id: objectid( req.body.id)}, newvalues, function(err, dbRes) {
          if (err) throw err;
         if(dbRes.modifiedCount === 1) {
          res.send({success: true, data: 'Updated customer Successfully'})
         } else {
          res.send({success: true, data: 'Not Updated'})
         }
          db.close();
        });
      });
    }
    
  }
  });

});

app.post('/deletecustomer', function(req,res) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection("customers").deleteOne({_id: objectid(req.body.id)}, function(err, obj) {
      if (err) throw err;
    res.send({success: true, data: obj});
      db.close();
    });
  });
})

app.post('/getLoginDetails', function(req, res)  {
  
  MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
    if(err){
      console.log(err);
      
    }else{
    var dbo = db.db("mydb");
    console.log(req);
    
    dbo.collection("employees").find({name: req.body.email , password: req.body.password}).toArray((err,docs)=>{
      if(err)     console.log("err",err);
      if (docs.length > 0) {
        res.send({Success: true,  data: docs});
      } else {
        res.send({Success: false,  Message: 'Invalid Credentials'});
      }
    });
  }
  });

});

app.get('/getEmployeeData', function (req, res)  {
  // if(err) res.send({'Success': false, data: err})

  MongoClient.connect(url, {useNewUrlParser: true}, function (err,db)  {
    dbo = db.db("mydb");

    dbo.collection("AllEmployess").find({}).toArray((err,docs)=> {
      if(err) res.send({'Success': false, data: err})
      console.log(docs);
      
      if(docs.length > 0) {
        res.send({'Success': false, data: docs})
      } else {
        res.send({Success: false,  Message: 'Error Fetching The Data'});
      }
    })
  })
})


// Send mail 

app.get('/mail', (req, res)=> {
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rndtechies369@gmail.com',
    pass: 'rndtechies@91119'
  }
});
var  mailOptions = {
from: 'katakamravishankar@gmail.com',
to: 'katakamravishankar@gmail.com',
subject: 'Test Mail',
text: 'this mail is regarding to test nodemailer in project. please remove this when u recieved'
};

transporter.sendMail(mailOptions, (err, mailres) => {

res.send('Email Sent . Please Check Once');
res.end();
})
})


app.get('/outlookmail', (req,res)=> {
nodeoutlook.sendEmail({
        host: 'smtp.office365.com',
        port: 587, 
        secure: false,
        requireTLS: false,
    auth: {
      user: 'info@rndtechies.com',
      pass: 'India@123$'
    },
    from: 'katakamravishankar@gmail.com',
    to: 'katakamravishankar@gmail.com',
    cc: '',
    bcc: '',
    subject: 'Hey you, awesome!',
   // html: '<b>This is bold text</b>',
    text: 'This is text version!',
    replyTo: 'katakamravishankar@gmail.com',
    onError: (e) => res.send(e),
    onSuccess: (i) => res.send('Email Sent' + i)
  });
})



app.listen(3000,()=>{
  console.log("running port 3000");
})
//module.exports = app;

