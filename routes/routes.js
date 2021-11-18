const bcrypt = require("bcryptjs")
const expressSession = require("express-session");
const {MongoClient, ObjectId} = require('mongodb');
const url = 'mongodb+srv://Yuki:Danganronpa12@cluster0.f4sjj.mongodb.net/myData?retryWrites=true&w=majority';
const client = new MongoClient(url);
const express = require("express");
const app = express();

const dbName = 'myData';
const db = client.db(dbName);
const collection = db.collection('Profiles');

app.use(expressSession({
    secret: 'unkn0wnW0rd',
    saveUninitialized: true,
    resave: true
}))

exports.index = (req,res) => {
    res.render('index', {
        title: 'Log In'
    })
}

exports.LoggingIn = async (req,res) => {
    await client.connect();
    console.log(req.body.username)
    const filterProfiles = await collection.find({username: req.body.username}).toArray();
    client.close();
    //Check if password matches for user
    console.log(req.body.username);
    console.log(filterProfiles);
    if(bcrypt.compareSync(`${req.body.password}`, `${filterProfiles[0].password}`))
    {
        res.render('loggedIn', {
            title: 'Home',
        });
    }
    else{
        res.redirect('/');
    }
}

exports.create = (req,res) => {
    res.render('create', {
        title: 'Create Profile'
    })
}

exports.createProfile = async (req,res) => {
    await client.connect();

    let salt = bcrypt.genSaltSync(10);
    let hashPass = bcrypt.hashSync(`${req.body.password}`, salt);

    let profile = {
        username: req.body.username,
        password: hashPass,
        email: req.body.email,
        age: req.body.age,
        color: req.body.color,
        entertainment: req.body.entertainment,
        degree: req.body.degree
    }
    const insertProfile = await collection.insertOne(profile);
    client.close();
    res.redirect('/');
}

exports.edit = async (req,res) => {
    await client.connect();
    const filterProfiles = await collection.find(ObjectId(req.params.id)).toArray();
    client.close()
    res.render('edit',{
        title: 'Edit Profile',
        profile: filterProfiles[0]
    })
}

exports.editProfile = async (req,res) => {
    await client.connect();

    let salt = bcrypt.genSaltSync(10);
    let hashPass = bcrypt.hashSync(`${req.body.password}`, salt);

    const updatePerson= await collection.updateOne(
        {_id: ObjectId(req.params.id) },
        { $set: {
            username: req.body.username,
            password: hashPass,
            email: req.body.email,
            age: req.body.age,
            color: req.body.color,
            entertainment: req.body.entertainment,
            degree: req.body.degree
        }}
    )
    client.close();
    res.redirect(`/home/${req.params.id}`);
}

exports.loggedIn = async (req,res) => {
    //Make like private page on previous in class
}

exports.logout = (req,res) => {
    req.session.destoy(err => {
        if(err){
            console.log(err)
        }
        else{
            res.redirect('/');
        }
    })
}