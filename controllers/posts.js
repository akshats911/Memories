import PostMessage from "../models/postMessage.js";
import mongoose from 'mongoose';

export const getPosts = async (req,res)=>{
    try {
        const postMessages = await PostMessage.find();
        // console.log(postMessages);
        res.status(200).json(postMessages);
        console.log("getPosts chala");
    } catch (error) {
        res.status(404).json({message: error.message});
        console.log(error);
    }
}

export const createPost = async (req,res)=>{
    const post = req.body;
    const newPost = new PostMessage({...post, creator: req.userId, createdAt: new Date().toISOString()});

    try {
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({message: error.message});
    }
}

export const updatePost = async (req,res)=>{
    const {id} = req.params;
    const post = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(`No post with id: ${id}`);
    }

    const updatedPost = await PostMessage.findByIdAndUpdate( id, {...post, id}, {new: true})
    res.json(updatedPost);
}

export const deletePost = async (req,res)=>{
    const {id} = req.params;
    console.log(req);
    // const creator = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(`No post with id: ${id}`);
    }
    console.log("deletePost chala");
    console.log(req.userId);
    // if (req.userId===post.creator) {
    //     await PostMessage.findByIdAndRemove(id);
    //     return res.status(200).json({message: "Post Deleted Successfully"});
    // }
    return res.status(401).json({message: "Unauthenticated to delete."});
}

export const likePost = async (req,res)=>{
    const {id} = req.params;
    console.log(req);
    if (!req.userId) {
        return res.json({message: "Unauthenticated @ posts.js"});
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(`No post with id: ${id}`);
    }


    const post = await PostMessage.findById(id);
    const index = post.likes.findIndex((id)=> id === String(req.userId));
    if (index===-1) {
        post.likes.push(req.userId);
    }else{
        post.likes = post.likes.filter((id)=> id !== String(req.userId));
    }
    const updatedPost= await PostMessage.findByIdAndUpdate(id, post, {new: true})
    console.log(updatedPost);
    res.json(updatedPost);
} 