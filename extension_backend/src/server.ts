import express,{ Request, Response } from "express";
import dotenv from 'dotenv';

import { arrayUnion, doc,updateDoc, getDoc,setDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
dotenv.config();
const arraySize=5;
interface Post{
    username:string,
    question:string,
    answer:string
}
interface Username{
    username:string,
}

const port=process.env.PORT|| 8000;
const firebaseConfig={
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId:process.env.MESSAGINGSENDERID,
    appId: process.env.APPID
}
const firebaseApp=initializeApp(firebaseConfig);
const db= getFirestore(firebaseApp);
const app=express();
app.listen(port,()=>{
    console.log(`port started ${port}`);

});
app.use(express.json());
app.get("/",(req:Request,res:Response)=>{
    res.send("Hi");
})
app.post("/user_exists",async (req:Request,res:Response)=>{
    try{
     const {username}=req.body as Username;
     console.log(username);
    const docRef=doc(db,"user",username);
    const docSnap=await getDoc(docRef);
    if(docSnap.exists()){
        res.status(400).send("Username already used :'(")                                                                                                                                                                                                                                                                                                                              
    }else{
        res.status(200).send("Username available");

    }
}
    catch(error){
        res.status(500).send(error)
    }
    

})
app.post("/create_user",async(req,res)=>{
    const {username}=req.body as Username;
    await setDoc(doc(db,"user",username),{
        username:username,
        posts:[]
    })
    res.status(200).send(":)");
    
})
app.post("/add_post",async(req,res)=>{
    const {username,question,answer}=req.body as Post;
    const map={question:answer}
    const docUpdate=doc(db,"user",username)
    await updateDoc(docUpdate,{
        posts:arrayUnion(map)
    })
    res.status(200).send(":)");
})
app.get("/all_posts",async(req,res)=>{
    const page=parseFloat(req.query.page as string);
    const username=req.headers.username as string;
    const docRef=doc(db,"user",username)
    const docSnap= await getDoc(docRef);
    if(docSnap.exists()){
        const data=docSnap.data();
        const posts=data.posts;
        const postSlice=posts.slice(arraySize*(page-1),arraySize*page);
        res.status(200).send(postSlice);

    }else{
        console.log("Why no user")
        res.status(404).send("Username not found ")
    }
})

