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
    // const ReviewCollection = client.db('BookCourier').collection('Reviews');

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

 } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).send({ error: "Failed to fetch property" });
  }
}

run().catch(console.dir);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})
