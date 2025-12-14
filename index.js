import express from 'express'
import cors from 'cors'
const app = express()
import dotenv from 'dotenv'
import { MongoClient, ServerApiVersion,ObjectId } from 'mongodb';
const port = process.env.PORT || 3000
dotenv.config()

// app.use(cors({
//   origin: ['http://localhost:3000',
//    'http://localhost:5173',
//   'http://localhost:5173',
//   'https://homenests.netlify.app',
//   'https://velvety-moxie-01f024.netlify.app'
//   ],
//   credentials: true
// }))
app.use(cors())
app.use(express.json()) 

app.get("/",async(req,res)=>{
    res.send("Hello World")
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2n5zm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection


    const BooksCollection = client.db('BookCourier').collection('Books');
    const OrdersCollection = client.db('BookCourier').collection('Orders');
    const WishlistsCollection = client.db('BookCourier').collection('Wishlists');

    app.get('/books',async(req,res)=>{
      const result = await BooksCollection.find().toArray()
      res.send(result)
    })

   app.get('/book/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const book = await BooksCollection.findOne(query);
    res.send(book); 
  }
  catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).send({ error: "Failed to fetch book" });
  }
})

app.post('/books',async(req,res)=>{
  const book = req.body;
  console.log(book);
  const result = await BooksCollection.insertOne(book);
  res.send(result)
})

 } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).send({ error: "Failed to fetch property" });
  }
}

app.get('/orders',async(req,res)=>{
  const email = req.query.email;
  let query = {};
  if(email){
    query={email:email}
  }
  const result = await OrdersCollection.find(query).toArray()
  res.send(result)
})

app.post('/orders',async(req,res)=>{
  const order = req.body;
  console.log(order);
  const result = await OrdersCollection.insertOne(order);
  res.send(result)
})

app.delete('/orders/:id',async(req,res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)};
  const result = await OrdersCollection.deleteOne(query);  
    res.send(result)
})

app.get('/wishlists',async(req,res)=>{
    const email =  req.query.email;
    let query = {};
    if(email){
      query={email:email}
    }
    const result = await WishlistsCollection.find(query).toArray()
    res.send(result)
  })
  
  app.post('/wishlists',async(req,res)=>{
    const wishlist = req.body;
    console.log(wishlist);
    const result = await WishlistsCollection.insertOne(wishlist);
    res.send(result)
  })

  
app.delete('/wishlists/:id',async(req,res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)};
  const result = await WishlistsCollection.deleteOne(query);
    res.send(result)
})  



run().catch(console.dir);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})
