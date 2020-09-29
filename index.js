const express = require("express");
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
const ObjectId = require('mongodb').ObjectId;
const password = "shawon";

const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://shawon:shawon@cluster0.bnrsn.mongodb.net/shawondb?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

client.connect((err) => {
  const productCollection = client.db("shawondb").collection("product");

 app.get("/product",(req,res) => {
   productCollection.find({})
   .toArray((err,document)=>{
     res.send(document);
   })
 })

 app.get('/product/:id', (req,res)=>{
  productCollection.find({_id:ObjectId(req.params.id)})
  .toArray((err,documents) =>{
    res.send(documents[0]);
  })
})

  app.post("/products",(req,res)=>{
    const products = req.body;
    productCollection.insertOne(products)
    .then(result =>{
      console.log("product added");
      
      res.redirect('/');
    })
  })
  
  app.post('/addProduct',(req,res) => {
    const product = req.body;
   productCollection.insertOne(product)
   .then(result=>{
     console.log("data added successfully");
     
   })
  })
   
 app.patch("/update/:id", (req,res) => {
   productCollection.updateOne(
     {_id: ObjectId(req.params.id)},
     { $set: {price : req.params.price , quantity: req.params.quantity }
    ,$currentDate: { lastModified: true }})
    .then(result => {
      res.send(result.modifiedCount > 0);
    });
 });


  app.delete("/delete/:id",(req,res) =>{
      productCollection.deleteOne({ 
        _id: ObjectId(req.params.id)
      })
      .then(result => {
          console.log(result);
          res.send(result.deletedCount>0);
      });
    
  });
  console.log("database connected");
});

  
  

app.listen(3000);
