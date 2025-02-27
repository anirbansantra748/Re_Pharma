const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const engine = require('ejs-mate');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const expressSession = require('express-session');
const methodOverride = require('method-override');
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

mongoose.connect('mongodb://127.0.0.1:27017/NEWMYAPP')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(expressSession({
    secret: 'AnirbanOpi1234',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 },
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

server.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
//ch
