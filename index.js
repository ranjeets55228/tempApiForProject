const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
.then((res) => {
    console.log('Db connected successfully.');
})
.catch((err) => {
    console.error(`Error in connecting database: ${err}`);
});

//Create user schema
const userSchema = mongoose.Schema({
    name: String,
    email: String,
    age: Number
});

//Create model
const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
    res.json({
        status: 'API Running'
    });
});

app.get('/users', async (req, res) => {
    try{
        const users = await User.find();
        return res.status(200).json({message: "success", users});
    }catch(err){
        console.error(err);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});

app.get('/user/:id', async (req, res) => {
    try{
        const userId = req.params.id;
        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({message: "User not found."});
        }

        return res.status(200).json({message: "success", data: user});

    }catch(err){
        console.error(err);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});

app.put('/user/:id', async (req, res) => {
    try{
        const {name, email} = req.body;
        const userId = req.params.id;
        const userUpdate = await User.findByIdAndUpdate(userId, {name, email}, { new: true, runValidators: true });

        if(!userUpdate){
            return res.status(404).json({message: "User not found."});
        }

        return res.status(200).json({message: "success", data: userUpdate});

    }catch(err){
        console.error(err);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});

app.delete('/user/:id', async (req, res) => {
    try{
        const userId = req.params.id;
        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({message: "User not found."});
        }

        await user.deleteOne();
        return res.status(200).json({message: "success", data: user});

    }catch(err){
        console.error(err);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});

app.post('/users', async (req, res) => {
    const {name, email, age} = req.body;
    const newUser = await User.create({
        name,
        email,
        age
    });

    return res.status(201).json({message: "User created successfully.", newUser});
});

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);
});
