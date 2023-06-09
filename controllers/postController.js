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
      userID: req.user.id,
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

    const garageSales = await Post.find({ date: { $gte: today } }).populate('userID');
    console.log(garageSales);
    const numOfPosts = garageSales.length

    res.render('mainPage/mainPage.ejs', { garageSales, numOfPosts });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};


exports.displaySellerHomeAllPosts = async (req, res) => {
  try {
    const isAuthenticated = req.isAuthenticated();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const garageSales = await Post.find({ date: { $gte: today } }).populate('userID');
    console.log(garageSales);
    const numOfPosts = garageSales.length

    res.render('sellerHome/sellerHomeAllPosts.ejs', { garageSales, isAuthenticated, numOfPosts });

  } catch (error) {
    console.log(error);
  }
}

// exports.displaySellerHomePage = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const sellersPosts = await Post.find({ userID: userId }).populate('userID');
//     const postToEdit = await Post.findById(req.params.id);
//     res.render('sellerHome/sellerHomeMain.ejs', { sellersPosts: sellersPosts, userID: userId, postToEdit }); // Pass sellersPosts variable to the view
//   } catch (error) {
//     console.error(error);
//   }
// };

exports.displaySellerHomePage = async (req, res) => {
  try {
    const userId = req.user._id;
    const sellersPosts = await Post.find({ userID: userId }).populate('userID');
    res.render('sellerHome/sellerHomeMain.ejs', { sellersPosts: sellersPosts });
  } catch (error) {
    console.error(error);
  }
};



exports.displayEditForm = async (req, res) => {
  try {
    const userId = req.params.id;
    const filter = { _id: userId };
    const sellersPosts = await Post.find(filter);
    const postToEdit = await Post.findById(req.params.id);

    if (!postToEdit) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    res.render('sellerHome/editPost.ejs', { sellersPosts: sellersPosts, postToEdit: postToEdit });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.updatePost = async (req, res) => {
  try {
    const postToEdit = await Post.findById(req.params.id);
    if (postToEdit) {
      postToEdit.title = req.body.title || postToEdit.title;
      postToEdit.description = req.body.description || postToEdit.description;
      postToEdit.location = req.body.location || postToEdit.location;
      postToEdit.date = req.body.date || postToEdit.date;
      postToEdit.time = req.body.time || postToEdit.time;

      const updatedPost = await postToEdit.save();
      res.redirect('/api/post/sellerHome'); // Redirect to the sellerHome route

    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};





