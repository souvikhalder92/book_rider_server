const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fwyrt73.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{


        const serviceCollection = client.db('bookRider').collection('services');
        const reviewCollection = client.db('bookRider').collection('reviews');
       

    
        app.get('/services', async (req,res) =>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);

        });
        app.get('/allservices', async (req,res) =>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);

        
        });
        app.post('/allservices', async (req,res) =>{
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result);

        
        });
        app.get('/allservices/:id',async (req,res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
          
        });
        app.get('/reviews',async (req,res) =>{
            let query = {};
            if(req.query.email && req.query._id)
            {
                query = {
                    
                    email: req.query.email,
                    id: req.query._id
                    
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
    
         });
         app.get('/reviews',async (req,res) =>{
            const  query = {};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
    
         });


     app.post('/reviews',async (req,res) =>{
        const review = req.body;
        const result = await reviewCollection.insertOne(review);
        res.send(result);

     });
     app.patch('/reviews/:id',async (req, res) => {
        const id = req.params.id;
        const status = req.body.status
        const query = { _id: ObjectId(id) }
        const updatedDoc = {
            $set:{
                status: status
            }
        }
        const result = await reviewCollection.updateOne(query, updatedDoc);
        res.send(result);
    })
     app.delete('/reviews/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await reviewCollection.deleteOne(query);
        res.send(result);
    })
   


    }
    finally{

    }

}
run().catch(error => console.log(error));


app.get('/',(req,res) =>{
    res.send('ok');
});

app.listen(port, () =>{
    console.log('running');

})