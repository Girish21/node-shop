const Product = require("../models/product");

const { validationResult } = require("express-validator/check");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    errorMessage: [],
    oldInputs: {
      title: "",
      imageUrl: "",
      price: "",
      description: ""
    }
  });
};

exports.postAddProduct = (req, res, next) => {
  // :: mongodb driver ::
  // const title = req.body.title;
  // const imageUrl = req.body.imageUrl;
  // const price = req.body.price;
  // const description = req.body.description;
  // const product = new Product(title, price, description, imageUrl, null, req.user._id);
  // product.save()
  //   .then(result => {
  //     // console.log(result);
  //     console.log('Created Product');
  //     res.redirect('/admin/products');
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });

  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;

  let errors = validationResult(req);

  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      errorMessage: [{ param: "image", msg: "Selected file is not an image" }],
      oldInputs: {
        title: title,
        price: price,
        description: description
      }
    });
  }

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      errorMessage: errors.array(),
      oldInputs: {
        title: title,
        price: price,
        description: description
      }
    });
  }

  const imageUrl = image.path;

  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  });
  product
    .save()
    .then(result => {
      res.redirect("/admin/products");
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  // :: mongodb driver ::
  // const editMode = req.query.edit;
  // if (!editMode) {
  //   return res.redirect('/');
  // }
  // const prodId = req.params.productId;
  // // req.user
  // //   .getProducts({ where: { id: prodId } })
  // Product.fetchById(prodId)
  //   .then(products => {
  //     // const product = products[0];
  //     console.log(products)
  //     if (!products) {
  //       return res.redirect('/');
  //     }
  //     res.render('admin/edit-product', {
  //       pageTitle: 'Edit Product',
  //       path: '/admin/edit-product',
  //       editing: editMode,
  //       product: products
  //     });
  //   })
  //   .catch(err => console.log(err));

  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;

  Product.findById(prodId, (err, product) => {
    if (!product) return res.redirect("/");
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
      errorMessage: [],
      isAuthenticated: req.session.isAuthenticated
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  // :: mongodb driver ::
  // const prodId = req.body.productId;
  // const updatedTitle = req.body.title;
  // const updatedPrice = req.body.price;
  // const updatedImageUrl = req.body.imageUrl;
  // const updatedDesc = req.body.description;
  // // Product.fetchById(prodId)
  // //   .then(product => {
  // //     product.title = updatedTitle;
  // //     product.price = updatedPrice;
  // //     product.description = updatedDesc;
  // //     product.imageUrl = updatedImageUrl;
  // //     return product.save();
  // //   })
  // const product = new Product(updatedTitle, updatedPrice, updatedDesc, updatedImageUrl, prodId)
  // product.save()
  //   .then(result => {
  //     console.log('UPDATED PRODUCT!');
  //     res.redirect('/admin/products');
  //   })
  //   .catch(err => console.log(err));

  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const image = req.file;
  const updatedDesc = req.body.description;

  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      errorMessage: errors.array(),
      oldInputs: {
        title: title,
        price: price,
        description: description
      }
    });
  }

  Product.findById(prodId, (err, product) => {
    if (product.userId.toString() == req.user._id) {
      product.title = updatedTitle;
      product.price = updatedPrice;
      if (image) product.imageUrl = image.path;
      product.description = updatedDesc;
      return product.save().then(result => {
        if (result) {
          return res.redirect("/admin/products");
        }
        // console.log()
      });
    }
    return res.redirect("/");
  });
};

exports.getProducts = (req, res, next) => {
  // :: mongodb driver ::
  // Product.fetchAll()
  //   .then(products => {
  //     res.render('admin/products', {
  //       prods: products,
  //       pageTitle: 'Admin Products',
  //       path: '/admin/products'
  //     });
  //   })
  //   .catch(err => console.log(err));

  Product.find({ userId: req.user._id })
    .then(products => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        isAuthenticated: req.session.isAuthenticated
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  // :: mongodb driver ::
  // const prodId = req.body.productId;
  // Product.deleteById(prodId)
  //   .then(result => {
  //     console.log('DESTROYED PRODUCT');
  //     res.redirect('/admin/products');
  //   })
  //   .catch(err => console.log(err));

  const prodId = req.body.productId;
  Product.deleteOne({ _id: prodId, userId: req.user._id }, err => {
    if (!err) return res.redirect("/admin/products");
  });
};
