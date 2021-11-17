const bcrypt = require("bcryptjs")
const expressSession = require("express-session");
const {MongoClient, ObjectId} = require('mongodb');
const url = 'mongodb+srv://Yuki:Danganronpa12@cluster0.f4sjj.mongodb.net/myData?retryWrites=true&w=majority';
const client = new MongoClient(url);

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

exports.LoggingIn = (req,res) => {
    await client.connect();
    //Put code to get all from database
    client.close();
    //Check if password matches for user
        //If yes go to logged in
        //If no Tell username or password is wrong
}

exports.create = (req,res) => {
    res.render('create', {
        title: 'Create Profile'
    })
}

exports.createPerson = async (req,res) => {
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

exports.editPerson = async (req,res) => {
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