const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Product = require('./model/product');
const WishList = require('./model/wishlist');

const db = mongoose.connect('mongodb://localhost/swag-shop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/product', (req, res) => {
  const product = new Product();

  product.title = req.body.title;
  product.price = req.body.price;

  product.save((err, savedProduct) => {
    if (err) {
      res.status(500).send({ error: 'Could not save product' });
    } else {
      res.send(savedProduct);
    }
  });
});

app.get('/product', (req, res) => {
  Product.find({}, (err, products) => {
    if (err) {
      res.status(500).send({ error: 'Could not fetch products' });
    } else {
      res.send(products);
    }
  });
});

app.get('/wishlist', (req, res) => {
  WishList.find({})
    .populate({ path: 'products', model: 'Product' })
    .exec((err, wishLists) => {
      if (err) {
        res.status(500).send({ error: 'Could not fetch wishlists' });
      } else {
        res.send(wishLists);
      }
    });
});

app.post('/wishlist', (req, res) => {
  const wishList = new WishList();

  wishList.title = req.body.title;

  wishList.save((err, newWishList) => {
    if (err) {
      res.status(500).send({ error: 'Could not create wishlist' });
    } else {
      res.send(newWishList);
    }
  });
});

app.put('/wishlist/product/add', (req, res) => {
  Product.findOne({ _id: req.body.productId }, (err, product) => {
    if (err) {
      res.status(500).sned({ error: 'Could not item to wish list' });
    } else {
      WishList.update(
        { _id: req.body.wishListId },
        {
          $addToSet: {
            products: product._id,
          },
        },
        (error, wishList) => {
          if (error) {
            res.status(500).sned({ error: 'Could not item to wish list' });
          } else {
            res.send('Successfully Added to Wish List');
          }
        }
      );
    }
  });
});

app.listen(3000, () => {
  console.log('Swag Shop API running on port 3000...');
});
