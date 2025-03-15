const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const engine = require('ejs-mate');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const expressSession = require('express-session');
const methodOverride = require('method-override');
const MongoStore = require('connect-mongo')
const http = require('http');
const socketIo = require('socket.io');
const { ExpressPeerServer } = require('peer');
let p =0
const User = require('./models/userSchema');
const Message = require('./models/messegeSchema');

const port = 3000;
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// PeerJS Server
const peerServer = ExpressPeerServer(server, { debug: true });
app.use('/peerjs', peerServer);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

let mongoUrl = 'mongodb+srv://opvmro460:oQSi3PUnafrbOwQv@cluster0.57nzu.mongodb.net/Re_Pharma?retryWrites=true&w=majority&appName=Cluster0';

const store =  MongoStore.create({
    mongoUrl:mongoUrl,
    crypto: {
      secret: "AnirbanOpi1234",
    },
    touchAfter: 24 * 3600,
  });

  store.on("error",()=>{
    console.log("error in moongoose session",err);
  });

// Session configuration
app.use(expressSession({
    store,
    secret: 'AnirbanOpi1234',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 }, // 1 week
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const homeRouts = require('./routes/indexRoutes');
const userRouts = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const postCommentRoutes = require('./routes/postCommentRoutes');
const therapistRoutes = require('./routes/therapistRoutes');
const aiRoutes = require('./routes/aiRoutes');
const consultationsRoutes = require('./routes/consultationRoutes');

app.use("/", homeRouts);
app.use("/users", userRouts);
app.use("/blogs", postRoutes);
app.use('/comments', postCommentRoutes);
app.use('/therapists', therapistRoutes);
app.use("/ai", aiRoutes);
app.use('/consultations',consultationsRoutes)

io.on('connection', (socket) => {
    console.log('A user connected.');

    socket.on('chatMessage', (data) => {
        io.emit('messageReceived', data);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected.');
    });

    socket.on('callUser', (data) => {
        io.to(data.userToCall).emit('incomingCall', { from: data.from, signal: data.signal });
    });

    socket.on('answerCall', (data) => {
        io.to(data.to).emit('callAccepted', data.signal);
    });
});

// 404 Not Found Handler
app.use((req, res, next) => {
    res.status(404).render('error', { error: { status: 404, message: "Page Not Found" } });
});

// General Error Handler
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).render('error', { error: { status, message } });
});

server.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
