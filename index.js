const express = require("express");
const pug = require("pug")
const path = require("path")
const bcrypt = require("bcryptjs")
const expressSession = require("express-session");
const {MongoClient, ObjectId} = require('mongodb');
const url = 'mongodb+srv://Yuki:Danganronpa12@cluster0.f4sjj.mongodb.net/myData?retryWrites=true&w=majority';
const client = new MongoClient(url);
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser('WebFinal'));

const dbName = 'myData';
const db = client.db(dbName);
const collection = db.collection('Profiles');

app.use(cookieParser());

app.use(expressSession({
    secret: 'unkn0wnW0rd',
    saveUninitialized: true,
    resave: true
}))

app.set('view engine', 'pug');
app.set('views', __dirname + '/views')
app.use(express.static(path.join(__dirname, '/public')));

const urlencodedparser = express.urlencoded({extended: false})

const checkAuth = (req,res,next) => {
    if(req.session.user && req.session.user.isAuthenticated)
    {
        next();
    }
    else{
        res.redirect('/');
    }
}

app.get('/', (req,res) => {
    res.render('index', {
        title: 'Log In'
    })
});

app.post('/', urlencodedparser ,async (req,res) => {
    await client.connect();
    console.log(req.body.username)
    const filterProfiles = await collection.find({username: req.body.username}).toArray();
    client.close();
    //Check if password matches for user
    console.log(req.body.username);
    console.log(filterProfiles);
    if(bcrypt.compareSync(`${req.body.password}`, `${filterProfiles[0].password}`))
    {
        req.session.user = {
            isAuthenticated: true,
            username: req.body.username
        }
        res.redirect('/home/' + req.session.user.username)
    }
    else{
        res.redirect('/');
    }
});

app.get('/create', (req,res) => {
    res.render('create', {
        title: 'Create Profile'
    })
});

app.post('/create', urlencodedparser, async (req,res) => {
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
});

app.get('/edit/:id', checkAuth, async (req,res) => {
    await client.connect();
    console.log('edit')
    const filterProfiles = await collection.find({username: req.session.user.username}).toArray();
    console.log(filterProfiles)
    client.close()
    res.render('edit',{
        title: 'Edit Profile',
        profile: filterProfiles[0]
    })
});

app.post('/edit/:id', urlencodedparser, checkAuth, async (req,res) => {
    await client.connect();

    let salt = bcrypt.genSaltSync(10);
    let hashPass = bcrypt.hashSync(`${req.body.password}`, salt);
    console.log('Person Edit')
    console.log(userName)

    const updatePerson= await collection.updateOne(
        collection.find({username: req.session.user.username}),
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
    res.redirect(`/home/${req.session.user.username}}`);
});

app.get('/home/:user', checkAuth, (req,res) => {
    res.render('loggedIn', {
        title: 'Home',
    });
});

app.get('/logout', (req,res) => {
    req.session.destroy(err => {
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/');
        }
    })
})

app.listen(3000);