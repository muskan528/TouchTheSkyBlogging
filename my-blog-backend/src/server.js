import fs from 'fs';
import admin from 'firebase-admin'
import  express from "express";
import {db,connectToDb} from './db.js'

const credentails=JSON.parse(
    fs.readFileSync('./credentials.json')
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
            return res.sendStatus(400)
        }
    }
    req.user=req.user||{}
    next();
})

app.get('/api/articles', async(req,res)=>{
    const article=await db.collection('articles').find({}).toArray();
    console.log(article)
    res.json(article)
})

app.use((req,res,next)=>{
    if(req.user)
        next();
    else res.sendStatus(401);
})

app.get('/api/articles/:name',async (req,res)=>{
    const {name}=req.params;
    const {uid}=req.user;

    const article=await db.collection('articles').findOne({name});
    if(article) {
        const upvoteIds=article.upvoteIds || [];
        article.canUpvote=uid&& !upvoteIds.includes(uid);
        res.json(article);
    }
    else {
        res.sendStatus(404).send('Article Not Found');
    }
})

app.put('/api/articles/:name/upvote',async (req,res)=>{
    const {name}=req.params
    const {uid}=req.user;
    const article=await db.collection('articles').findOne({name});
    if(article) {
        const upvoteIds=article.upvoteIds || [];
        const canUpvote=uid&& !upvoteIds.include(uid);
        if(canUpvote) {
            await db.collection('articles').updateOne({name},{
                $inc:{upvotes:1},
                $push:{upvoteIds:uid}
            });
        }
        const updatedArticle=await db.collection('articles').findOne({name});
        res.json(updatedArticle)
    } else {
        res.send('The article doesn\'t exist')
    }
})

app.post('/api/articles/:name/comments',async (req,res)=>{
    const {text}=req.body;
    const {name}=req.params;
    const {email} = req.user;
    
    await db.collection('articles').updateOne({name},{
        $push:{comments:{postedBy:email, text}},
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
