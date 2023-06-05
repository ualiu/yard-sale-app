const Post = require('../models/postModel')

// displays new customer form -- added after
exports.displayNewCustomerForm = (req, res) => {
  console.log('end point hit ok')
  res.render('sellerHome/new.ejs');
};

exports.displaySellerHomePage = (req, res) => {
  console.log('end point hit ok')
  res.render('sellerHome/sellerHomeMain.ejs');
};

exports.postGarageSale = async (req, res, next) => {
  const { title, description, location, date, time} = req.body;

  // // Round itemPrice to 2 decimal places for each item
  // items.forEach(item => {
  //     item.itemPrice = Math.round(item.itemPrice * 100) / 100;
  // });

  let garageSale = new Post({
      title,
      description,
      location,
      date: new Date(date),
      time,
      // items, // items is already an array of objects with correct format
      // userID: req.user._id // Assuming you have middleware that sets req.user
  });
  try {
      await garageSale.save();
      res.redirect('/api/post/sellerHome');
  } catch (error) {
      next(error);
  }
}

exports.getAllPosts = async (req,res) => {
  try {
    const garageSales = await Post.find().populate();
    console.log(garageSales);
    res.render('mainPage/mainPage.ejs', { garageSales });
  } catch (error) {
    console.error(error);
  }
}

