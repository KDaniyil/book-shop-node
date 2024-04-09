const fs = require("fs");
const path = require("path");

const pathFile = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);

const Cart = require("./cart.model");

const getProductsFromFile = (cb) => {
  fs.readFile(pathFile, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (p) => p.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(pathFile, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(pathFile, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  }

  static getProductById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      cb(product);
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static deleteById(id) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      const updatedProducts = products.filter((p) => p.id !== id);
      fs.writeFile(pathFile, JSON.stringify(updatedProducts), (err) => {
        if (!err) {
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }
};
