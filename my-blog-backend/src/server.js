import fs from 'fs';
import admin from 'firebase-admin'
import  express from "express";
import {db,connectToDb} from './db.js'

const credentails=JSON.parse(
    fs.readFileSync('../credentials.json')
);

admin.initializeApp({
    credential: admin.credential.cert(credentails),
});
const app = express();
app.use(express.json())

app.use(async(req, res, next) => {
    const {authtoken}=req.headers;
    if(authtoken) {
        try {
            req.user=await admin.auth().verifyIdToken(authtoken);
        } catch(e) {
            res.sendStatus(400)
        }
    }
    next();
})

app.get('/api/articles', async(req,res)=>{
    const article=await db.collection('articles').find({}).toArray();
    console.log(article)
    res.json(article)
})

app.get('/api/articles/:name',async (req,res)=>{
    const {name}=req.params;
    const {uid}=req.user;

    const article=await db.collection('articles').findOne({name});
    if(article) {
        const upvoteIds=articles.upvoteIds || [];
        article.canUpvote=uid&& !upvoteIds.include(uid);
        res.json(article);
    }
    else {
        res.sendStatus(404).send('Article Not Found');
    }
})

app.put('/api/articles/:name/upvote',async (req,res)=>{
    const {name}=req.params
    
    await db.collection('articles').updateOne({name},{
        $inc:{upvotes:1},
    });
    const article=await db.collection('articles').findOne({name});
    if(article) {
        res.json(article)
    } else {
        res.send('The article doesn\'t exist')
    }
})

app.post('/api/articles/:name/comments',async (req,res)=>{
    const {postedBy, text}=req.body;
    const {name}=req.params;
    
    await db.collection('articles').updateOne({name},{
        $push:{comments:{postedBy, text}},
    });
    const article=await db.collection('articles').findOne({name});
    if(article) {
        res.json(article)
    }
    else {
        res.send("That article doesn\'t exsit");
    }
})

connectToDb(()=>{
    app.listen(8000, ()=>{
        console.log("Server is listening on port 8000");
    })
})
