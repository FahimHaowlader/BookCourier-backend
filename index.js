import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
dotenv.config()
import jwt from 'jsonwebtoken'
import { MongoClient, ServerApiVersion,ObjectId } from 'mongodb';
const port = process.env.PORT || 3000
const app = express()
app.use(cookieParser());


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


const verifyUser = (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).send({ message: 'Unauthorized access' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: 'Forbidden access' });
    }

    req.user = decoded; // { email, role }
    next();
  });
};

const verifyRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).send({ message: 'Access denied' });
    }
    next();
  };
};



app.post('/jwt', async (req, res) => {
  const user = req.body;
const token = jwt.sign(
  { email: user.email, role: user.role },
  process.env.ACCESS_TOKEN_SECRET,
  { expiresIn: '7d' }
);

res.cookie('accessToken', token, {
  httpOnly: true,
  secure: true,
  // sameSite: 'strict',
});

res.send({ success: true });

});

app.get('/logout', (req, res) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.send({ success: true });
});


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
    const UsersCollection = client.db('BookCourier').collection('Users');

    app.get('/all-users',verifyUser,verifyRole('admin'),async(req,res)=>{
      const result = await UsersCollection.find().toArray()
      res.send(result)
    })

    app.get('/users/:email',async(req,res)=>{
      const email = req.params.email;
      const query = {email: email};
      const user = await UsersCollection.findOne(query);
      if(!user){
        throw new Error('User not found');
      }
     return res.send({exists: true, user})      
    })

    app.post('/users',async(req,res)=>{
      const user = req.body;
      const email = user.email;
      const query = {email: email};
      const existingUser = await UsersCollection.findOne(query);
      if(existingUser){
        return res.send({message: 'User already exists'})
      }
      console.log(user);
        const result = await UsersCollection.insertOne(user);
        res.send(result)
    })


    app.patch('/users/:id',verifyUser,async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const updatedUser = req.body;
      const updateDoc = {
        $set: updatedUser
      };
      const result = await UsersCollection.updateOne(filter,updateDoc);
      res.send(result)
    })

    app.patch('/users-role/:id',verifyUser,verifyRole('admin'),async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const updatedUser = req.body;
      const updateDoc = {
        $set: {
          role: updatedUser.role
        },
      };
      const result = await UsersCollection.updateOne(filter,updateDoc);
      res.send(result)
    })

    app.get('/books',async(req,res)=>{
      const result = await BooksCollection.find().toArray()
      res.send(result)
    })
    app.get('/latest-books',async(req,res)=>{
      const result = await BooksCollection.find().limit(6).toArray()
      res.send(result)
    })

//     app.get('/books/:sort', async (req, res) => {
//   try {
//     const sortParam = req.params.sort;
//     let sortCriteria = {};

//     if (sortParam === 'asc') {
//       sortCriteria = { price: 1 }; // Ascending order
//     } else if (sortParam === 'desc') {
//       sortCriteria = { price: -1 }; // Descending order
//     } else {
//       return res.status(400).send({ error: "Invalid sort parameter" });
//     }

//     const result = await BooksCollection.find().sort(sortCriteria).toArray();
//     res.send(result);
//   }
//   catch (error) {
//     console.error("Error fetching sorted books:", error);
//     res.status(500).send({ error: "Failed to fetch sorted books" });
//   }
// });

app.get('/my-books/:email',verifyUser,verifyRole('librarian'),async(req,res)=>{
  const email = req.params.email;
  const query = {sellerEmail: email};
  const result = await BooksCollection.find(query).toArray()
  res.send(result)
})

   app.get('/book/:id',verifyUser, async (req, res) => {
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

app.delete('/books/:id',verifyUser,verifyRole('admin'),async(req,res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)};
  const result = await BooksCollection.deleteOne(query);
  res.send(result)
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

app.get('/orders',verifyUser,async(req,res)=>{
  const email = req.query.email;
  let query = {};
  if(email){
    query={email:email}
  }
  const result = await OrdersCollection.find(query).toArray()
  res.send(result)
})
app.get('/all-orders',verifyUser,verifyRole('librarian'),async(req,res)=>{
  const result = await OrdersCollection.find().toArray()
  res.send(result)
})

app.post('/orders',verifyUser,async(req,res)=>{
  const order = req.body;
  console.log(order);
  const result = await OrdersCollection.insertOne(order);
  res.send(result)
})

app.delete('/orders/:id',verifyUser,async(req,res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)};
  const result = await OrdersCollection.deleteOne(query);  
    res.send(result)
})

app.get('/wishlists',verifyUser,async(req,res)=>{
    const email =  req.query.email;
    let query = {};
    if(email){
      query={email:email}
    }
    const result = await WishlistsCollection.find(query).toArray()
    res.send(result)
  })
  
  app.post('/wishlists',verifyUser,async(req,res)=>{
    const wishlist = req.body;
    console.log(wishlist);
    const result = await WishlistsCollection.insertOne(wishlist);
    res.send(result)
  })


app.delete('/wishlists/:id',verifyUser,async(req,res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)};
  const result = await WishlistsCollection.deleteOne(query);
    res.send(result)
})  



run().catch(console.dir);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})
