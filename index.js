const express = require("express");
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

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

  app.post("/products",(req,res)=>{
    const products = req.body;
    productCollection.insertOne(products)
    .then(result =>{
      console.log("product added");
      res.send("success");
    })
  })
  
  app.post('/addProduct',(req,res) => {
    const product = req.body;
   productCollection.insertOne(product)
   .then(result=>{
     console.log("data added successfully");
     res.send("success");
   })
  })
  });

  console.log("database connected");

app.listen(3000);
