// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const Product = sequelize.define('product', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   title: Sequelize.STRING,
//   price: {
//     type: Sequelize.DOUBLE,
//     allowNull: false
//   },
//   imageUrl: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   description: {
//     type: Sequelize.STRING,
//     allowNull: false
//   }
// });

// module.exports = Product;


// :: mongodb driver ::
// const mongodb = require('mongodb');
// const getDB = require('../util/database').getDB;

// class Product { 
//   constructor(title, price, description, imageUrl, _id, userId) { 
//     this.title = title;
//     this.price = price;
//     this.description = description
//     this.imageUrl = imageUrl;
//     this._id = _id !== null ? new mongodb.ObjectID(this._id) : null;
//     this.userId = userId;
//   }

//   save() { 
//     const db = getDB();
//     let dbOp;
//     if (this._id) { 
//       dbOp = db.collection('products').updateOne({ _id: this._id}, { $set: this })
//     } else { 
//       dbOp = db.collection('products').insertOne(this)
//     }
//     return dbOp
//       .then(result => console.log(result))
//       .catch(err => console.log(err));
//   }

//   static fetchAll() { 
//     const db = getDB();
//     return db.collection('products')
//       .find()
//       .toArray()
//       .then(product => { return product })
//       .catch(err => console.warn(err));   
//   }

//   static fetchById(id) { 
//     const db = getDB();
//     return db.collection('products')
//       .find({ _id: new mongodb.ObjectID(id) })
//       .next()
//       .then(product => { return product })
//       .catch(err => console.warn(err))
//   }

//   static deleteById(id) { 
//     const db = getDB();
//     return db.collection('products')
//       .deleteOne({ _id: mongodb.ObjectID(id) })
//       .then(ret => { return ret })
//       .catch(err => console.log(err))
//   }
// }

// module.exports = Product;


const monggose = require('mongoose');
const Schema = monggose.Schema;

const ProductSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

module.exports = monggose.model('Product', ProductSchema)