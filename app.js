const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const csrf = require('csurf')
const flash = require('connect-flash')

const errorController = require('./controllers/error');
const User = require('./models/user');

const mongoose = require('mongoose');
// const sequelize = require('./util/database');
// const Product = require('./models/product');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');
// const Order = require('./models/order');
// const OrderItem = require('./models/order-item');

const MONGO_DB_URI = 'mongodb+srv://girish21:DdtYy5wYu3n87WB@cluster0-efuzf.gcp.mongodb.net/test';

const app = express();
const store = new MongoDBStore({
    uri: MONGO_DB_URI,
    collection: 'sessions',

});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: false,
    store: store
}))

app.use(csrf())
app.use(flash())

app.use((req, res, next) => {
    if (req.session.user)
        User.findById(req.session.user._id, (err, user) => {
            req.user = user;
            next();
        })
    else
        next();
})

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isAuthenticated;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

// Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
// User.hasMany(Product);
// User.hasOne(Cart);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });
// Order.belongsTo(User);
// User.hasMany(Order);
// Order.belongsToMany(Product, { through: OrderItem });

// sequelize
//   // .sync({ force: true })
//   .sync()
//   .then(result => {
//     return User.findById(1);
//     // console.log(result);
//   })
//   .then(user => {
//     if (!user) {
//       return User.create({ name: 'Max', email: 'test@test.com' });
//     }
//     return user;
//   })
//   .then(user => {
//     // console.log(user);
//     return user.createCart();
//   })
//   .then(cart => {
//     app.listen(3000);
//   })
//   .catch(err => {
//     console.log(err);
//   });

// :: mongoDB :: 
// mongoConnect.MongoConnect((c) => {
//     app.listen(3000);
// })

// :: mongoose ::
mongoose.connect(MONGO_DB_URI, { useNewUrlParser: true })
    .then((connection) => {
        // User.findOne().then(user => {
        //     if (!user) {
        //         const user = new User({
        //             userName: 'Girish',
        //             email: 'xyz@xyz.com',
        //             cart: {
        //                 items: []
        //             }
        //         })
        //         user.save();
        //     }
        // })
        app.listen(3000);
    })
    .catch(err => console.log(err))
