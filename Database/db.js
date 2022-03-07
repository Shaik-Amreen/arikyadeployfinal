const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://placement:placement@cluster0.i5cpa.mongodb.net/mitspcell?retryWrites=true&w=majority",
  {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, //make this true
    autoIndex: true
  }).then((result) => {
    console.log('Mongodb connection succeeded in heroku')
  }).catch((err) => {
    console.log('error while connecting Mongodb' + JSON.stringify(err, undefined, 2))
  })

//mongodb+srv://placement:placement@cluster0.i5cpa.mongodb.net/mitspcell?retryWrites=true&w=majority
//mongodb://127.0.0.1:27017/mitspcell  
//mongodb+srv://harsha:<password>@cluster0.cfwgd.mongodb.net/arikya?retryWrites=true&w=majority