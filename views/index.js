const express = require("express");
const pug = require("pug")
const path = require("path")
const routes = require("./routes/routes");
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser('WebFinal'));

app.set('view engine', 'pug');
app.set('views', __dirname + '/views')
app.use(express.static(path.join(__dirname, '/public')));

const urlencodedparser = express.urlencoded({extended: false})

app.get('/', routes.index);
app.post('/', urlencodedparser ,routes.LoggingIn);
app.get('/create', routes.create);
app.post('/create', urlencodedparser, routes.createProfile);
app.get('/edit/:id', routes.edit);
app.get('/edit/:id', urlencodedparser, routes.editProfile);
app.get('/home/:id', routes.loggedIn);
app.get('/logout', routes.logout);

app.listen(3000);