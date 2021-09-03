const express = require('express');
const bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;



const password = "";
const uri = "mongodb+srv://SazzadHossain:karatiatangail243@cluster0.9ihy7.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.get('/', (req, res) => {
// res.send("Hello I am working");
// })

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})





client.connect(err => {
    const collection = client.db("organicdb").collection("products");
    // perform actions on the collection object

    app.get('/products', (req, res) => {
        collection.find({})
            .toArray((error, document) => {
                res.send(document);
            })
    })

    app.get('/product/:id', (req, res) => {
        collection.find({ _id: ObjectId(req.params.id) })
            .toArray((error, document) => {
                res.send(document[0]);
            })
    })

    app.post("/addProduct", (req, res) => {
        const product = req.body;
        collection.insertOne(product)
            .then(result => {
                console.log("data added");
                res.redirect("/");
            })
    })

    app.patch('/update/:id', (req, res) => {
        collection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: { price: req.body.price, quantity: req.body.quantity }

            }
        )
            .then(result => {
                res.send(result.modifiedCount > 0);
            })
    })

    app.delete('/delete/:id', (req, res) => {
        collection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0);
            })
    })



});


app.listen(3000);