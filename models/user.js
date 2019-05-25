// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const User = sequelize.define('user', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   name: Sequelize.STRING,
//   email: Sequelize.STRING
// });

// :: mongodb driver ::
// const mongodb = require('mongodb');
// const getDB = require('../util/database').getDB;

// class User {
//   constructor(userName, email, cart, _id) {
//     this.userName = userName;
//     this.email = email
//     this.cart = cart;
//     this._id = new mongodb.ObjectID(_id);
//   }

//   save() {
//     return getDB().collection('users')
//       .insertOne(this)
//       .then(res => console.log(res))
//       .catch(err => console.log(err))
//   }

//   addToCart(product) {
//     let updatedCart;
//     let newQuantity = 1;
//     if (this.cart.items !== null) {
//       const cartProductIndex = this.cart.items.findIndex(ele => {
//         return ele.productId.toString() === product._id.toString()
//       })
//       updatedCart = [...this.cart.items];

//       if (cartProductIndex >= 0) {
//         newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//         updatedCart[cartProductIndex].quantity = newQuantity;
//       } else {
//         updatedCart.push({ productId: new mongodb.ObjectID(product._id), quantity: newQuantity });
//       }
//     } else {
//       updatedCart = [{ productId: new mongodb.ObjectID(product._id), quantity: newQuantity }]
//     }
//     updatedCart = { items: updatedCart };
//     return getDB()
//       .collection('users')
//       .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
//   }

//   getCart() {
//     const productIds = this.cart.items.map(ele => {
//       return ele.productId;
//     })
//     return getDB().collection('products')
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then(products => {
//         return products.map(ele => {
//           return {
//             ...ele, quantity: this.cart.items.find(i => {
//               return ele._id.toString() === i.productId.toString()
//             }).quantity
//           }
//         })
//       });
//   }

//   deleteFromCart(id) {
//     let cartItems = [...this.cart.items];
//     let updatedCart = cartItems.filter(ele => {
//       return ele.productId.toString() !== id.toString()
//     })
//     return getDB().collection('users')
//       .updateOne({ _id: this._id }, { $set: { cart: { items: updatedCart } } })
//   }

//   addOrder() {
//     return this.getCart()
//       .then(products => {
//         return getDB().collection('orders')
//           .insertOne({
//             items: products,
//             user: {
//               _id: this._id,
//               name: this.userName
//             }
//           })
//           .then(result => {
//             this.cart = { items: [] }
//             return getDB().collection('users')
//               .updateOne({ _id: this._id }, { $set: { cart: { items: [] } } })
//           })
//           .catch(err => console.log(err))
//       })
//   }

//   getOrders() {
//     return getDB().collection('orders')
//       .find({ 'user._id': this._id  })
//       .toArray()
//       .then(orders => { return orders })
//       .catch(err => console.log(err))
//   }

//   static findById(id) {
//     return getDB().collection('users')
//       .findOne({ _id: new mongodb.ObjectID(id) })
//       .then(res => { return res })
//       .catch(err => console.log(err))
//   }
// }

// module.exports = User;


const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [{
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      }
    }]
  }
})

userSchema.methods.addToCart = function (product) {
  let updatedCart;
  let newQuantity = 1;
  if (this.cart.items !== null) {
    const cartProductIndex = this.cart.items.findIndex(ele => {
      return ele.productId.toString() === product._id.toString()
    })
    updatedCart = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCart[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCart.push({ productId: product._id, quantity: newQuantity });
    }
  } else {
    updatedCart = [{ productId: product._id, quantity: newQuantity }]
  }
  updatedCart = { items: updatedCart };
  this.cart = updatedCart;
  return this.save();
}

userSchema.methods.deleteFromCart = function (id) {
  let cartItems = [...this.cart.items];
  let updatedCart = cartItems.filter(ele => {
    return ele.productId.toString() !== id.toString()
  })
  this.cart.items = updatedCart;
  return this.save();
}

module.exports = mongoose.model('User', userSchema);