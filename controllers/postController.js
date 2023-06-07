const Post = require('../models/postModel')

// displays new customer form -- added after
exports.displayNewListingForm = (req, res) => {
  console.log('end point hit ok')
  res.render('sellerHome/new.ejs');
};

exports.displaySellerHomePage = (req, res) => {
  console.log('end point hit ok')
  res.render('sellerHome/sellerHomeMain.ejs');
};

exports.postGarageSale = async (req, res, next) => {
  const { title, description, location, date, time} = req.body;
  let garageSale = new Post({
      title,
      description,
      location,
      date: new Date(date),
      time,
  });
  try {
      await garageSale.save();
      res.redirect('/api/post/sellerHome');
  } catch (error) {
      next(error);
  }
}

exports.getAllPosts = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const garageSales = await Post.find({ date: { $gte: today } }).populate();
    console.log(garageSales);

    res.render('mainPage/mainPage.ejs', { garageSales });
  } catch (error) {
    console.error(error);
  }
};

exports.displaySellerHomeAllPosts = async (req, res) => {
  try {
    const isAuthenticated = req.isAuthenticated();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const garageSales = await Post.find({ date: { $gte: today } }).populate();
    console.log(garageSales);

    res.render('sellerHome/sellerHomeAllPosts.ejs', { garageSales, isAuthenticated });

  } catch (error) {
    console.log(error);
  }
}

