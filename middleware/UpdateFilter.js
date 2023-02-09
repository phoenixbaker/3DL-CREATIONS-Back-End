let Filter = require("../schemas/Filter");
let Products = require("../schemas/Product");

async function updateFilter(req, res, next) {
  let [filter] = await Filter.find({});
  let products = await Products.find({}).sort({ price: 1 });

  let i = 0;
  console.log(filter);

  if (+products[i].price !== filter.price[0]) {
    while (+products[i].price <= filter.price[0]) i++;
    filter.price[0] = products[i].price;
  }

  i = products.length - 1;
  if (+products[i].price !== filter.price[1]) {
    while (+products[i].price >= filter.price[1]) i--;
    filter.price[1] = products[i].price;
  }

  products = await Products.find({}).sort({ size: -1 });

  i = 0;
  if (+products[i].size !== filter.size[0]) {
    while (+products[i].size <= filter.size[0]) i++;
    filter.size[0] = products[i].size;
  }

  i = products.length - 1;
  if (+products[i].size !== filter.size[1]) {
    while (+products[i].size >= filter.size[1]) i--;
    filter.size[1] = products[i].size;
  }

  let tempObj = {};

  products.forEach((prod) => {
    prod.tags.forEach((tag) => {
      if (!tempObj[tag]) tempObj[tag] = true;
    });
  });

  filter.tags.forEach((tag) => {
    if (tempObj[tag]) return delete tempObj[tag];
    else return (tempObj[tag] = false);
  });

  let extraTags = Object.keys(tempObj);

  let tempArr = filter.tags;
  while (extraTags.length) {
    let target = extraTags.pop();
    tempArr = tempArr.filter((e) => e != target);
  }
  filter.tags = tempArr;

  let reqFilter = {
    price: req.body.productPrice,
    size: req.body.productSize,
    tags: req.body.productTags,
  };

  if (filter.price[0] > reqFilter.price) filter.price[0] = reqFilter.price;
  if (filter.price[1] < reqFilter.price) filter.price[1] = reqFilter.price;

  if (filter.size[0] > reqFilter.size) filter.size[0] = reqFilter.size;
  if (filter.size[1] < reqFilter.size) filter.size[1] = reqFilter.size;

  reqFilter.tags.forEach((tag) => {
    if (!filter.tags.includes(tag)) filter.tags.push(tag);
  });

  filter.save();
  next();
}

module.exports = updateFilter;
