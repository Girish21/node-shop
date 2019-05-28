const fs = require("fs");
const path = require("path");
const Product = require("../models/product");
const Order = require("../models/order");
const PDFDocument = require("pdfkit");

exports.getProducts = (req, res, next) => {
  // :: mongodb driver ::
  // Product.fetchAll()
  //   .then(products => {
  //     res.render('shop/product-list', {
  //       prods: products,
  //       pageTitle: 'All Products',
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });

  Product.find((err, products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
      isAuthenticated: req.session.isAuthenticated
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // Product.findAll({ where: { id: prodId } })
  //   .then(products => {
  //     res.render('shop/product-detail', {
  //       product: products[0],
  //       pageTitle: products[0].title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));

  // :: mongodb driver ::
  // Product.fetchById(prodId)
  //   .then(product => {
  //     res.render('shop/product-detail', {
  //       product: product,
  //       pageTitle: product.title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));

  Product.findById(prodId, (err, product) => {
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
      isAuthenticated: req.session.isAuthenticated
    });
  });
};

exports.getIndex = (req, res, next) => {
  // :: mongodb driver ::
  // Product.fetchAll()
  //   .then(products => {
  //     res.render('shop/index', {
  //       prods: products,
  //       pageTitle: 'Shop',
  //       path: '/'
  //     });
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });

  Product.find((err, products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/"
    });
  });
};

exports.getCart = (req, res, next) => {
  // req.user
  //   .getCart()
  //   .then(cart => {
  //     return cart
  //       .getProducts()
  //       .then(products => {
  //         res.render('shop/cart', {
  //           path: '/cart',
  //           pageTitle: 'Your Cart',
  //           products: products
  //         });
  //       })
  //       .catch(err => console.log(err));
  //   })
  //   .catch(err => console.log(err));

  // :: mongodb driver ::
  req.user.populate("cart.items.productId", (err, products) => {
    if (!err)
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products.cart.items,
        isAuthenticated: req.session.isAuthenticated
      });
  });
  // .then()
  // .catch(err => console.log(err))
};

exports.postCart = (req, res, next) => {
  // :: mongodb driver ::
  // const prodId = req.body.productId;
  // Product.fetchById(prodId)
  //   .then(prod => {
  //     req.user.addToCart(prod)
  //     res.redirect('/cart');
  //   })

  const prodId = req.body.productId;
  Product.findById(prodId, (err, product) => {
    if (!err) {
      return req.user.addToCart(product);
    }
  }).then(() => {
    res.redirect("/cart");
  });

  // let fetchedCart;
  // let newQuantity = 1;
  // req.user
  //   .getCart()
  //   .then(cart => {
  //     fetchedCart = cart;
  //     return cart.getProducts({ where: { id: prodId } });
  //   })
  //   .then(products => {
  //     let product;
  //     if (products.length > 0) {
  //       product = products[0];
  //     }

  //     if (product) {
  //       const oldQuantity = product.cartItem.quantity;
  //       newQuantity = oldQuantity + 1;
  //       return product;
  //     }
  //     return Product.findById(prodId);
  //   })
  //   .then(product => {
  //     return fetchedCart.addProduct(product, {
  //       through: { quantity: newQuantity }
  //     });
  //   })
  //   .then(() => {
  //     res.redirect('/cart');
  //   })
  //   .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  // req.user
  //   .getCart()
  //   .then(cart => {
  //     return cart.getProducts({ where: { id: prodId } });
  //   })
  //   .then(products => {
  //     const product = products[0];
  //     return product.cartItem.destroy();
  //   })
  //   .then(result => {
  //     res.redirect('/cart');
  //   })
  //   .catch(err => console.log(err));

  // :: mongodb driver ::
  // req.user
  //   .deleteFromCart(prodId)
  //   .then(result => {
  //     res.redirect('/cart');
  //   })
  //   .catch(err => console.log(err))

  req.user
    .deleteFromCart(prodId)
    .then(result => {
      res.redirect("/cart");
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  // let fetchedCart;
  // req.user
  //   .getCart()
  //   .then(cart => {
  //     fetchedCart = cart;
  //     return cart.getProducts();
  //   })
  //   .then(products => {
  //     return req.user
  //       .createOrder()
  //       .then(order => {
  //         return order.addProducts(
  //           products.map(product => {
  //             product.orderItem = { quantity: product.cartItem.quantity };
  //             return product;
  //           })
  //         );
  //       })
  //       .catch(err => console.log(err));
  //   })
  //   .then(result => {
  //     return fetchedCart.setProducts(null);
  //   })
  //   .then(result => {
  //     res.redirect('/orders');
  //   })
  //   .catch(err => console.log(err));

  // :: mongodb driver ::
  // req.user.addOrder()
  //   .then(result => {
  //     res.redirect('/orders');
  //   })

  let cart;
  req.user.populate("cart.items.productId", (err, prods) => {
    cart = prods.cart.items;
    if (cart) {
      let products = cart.map(ele => {
        return {
          product: { ...ele.productId._doc },
          quantity: ele.quantity
        };
      });

      // console.log(products);

      const order = new Order({
        user: {
          name: req.user.email,
          userId: req.user
        },
        products: products
      });

      order.save().then(() => {
        req.user.cart = { items: [] };
        req.user.save().then(() => {
          res.redirect("/");
        });
      });
    }
  });
};

exports.getOrders = (req, res, next) => {
  // req.user
  //   .getOrders({include: ['products']})
  //   .then(orders => {
  //     res.render('shop/orders', {
  //       path: '/orders',
  //       pageTitle: 'Your Orders',
  //       orders: orders
  //     });
  //   })
  //   .catch(err => console.log(err));

  // :: mongodb driver ::
  // req.user
  //   .getOrders()
  //   .then(orders => {
  //     res.render('shop/orders', {
  //       path: '/orders',
  //       pageTitle: 'Your Orders',
  //       orders: orders
  //     });
  //   })
  //   .catch(err => console.log(err))

  Order.find({ "user.userId": req.user._id }, (err, orders) => {
    if (!err) {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
        isAuthenticated: req.session.isAuthenticated
      });
    }
  });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then(order => {
      if (!order) return next();
      if (req.user._id.toString() !== order["user"]["userId"].toString())
        return next();
      else {
        const invoice = "invoice-" + orderId + ".pdf";
        const filePath = path.join("data", "invoices", invoice);
        // fs.readFile(filePath, null, (err, data) => {
        //   if (err) {
        //     console.log(err);
        //     return next();
        //   }
        //   res.setHeader("Content-Type", "application/pdf");
        //   res.setHeader(
        //     "Content-Disposition",
        //     'inline; filename="' + invoice + '"'
        //   );
        //   res.send(data);
        // });
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          'inline; filename="' + invoice + '"'
        );
        const pdfDoc = new PDFDocument();
        pdfDoc.pipe(fs.createWriteStream(filePath));
        pdfDoc.pipe(res);

        pdfDoc.text("Hello Word!");
        pdfDoc.end();
        // const file = fs.createReadStream(filePath);
        // res.setHeader("Content-Type", "application/pdf");
        // res.setHeader(
        //   "Content-Disposition",
        //   'inline; filename="' + invoice + '"'
        // );
        // file.pipe(res);
      }
    })
    .catch(err => {
      console.log(err);
    });
};
