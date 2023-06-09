const Post = require('../models/postModel')
const moment = require('moment');

// displays new customer form -- added after
exports.displayNewListingForm = (req, res) => {
  console.log('end point hit ok')
  res.render('sellerHome/new.ejs');
};

exports.displaySellerHomePage = (req, res) => {
  console.log('end point hit ok')
  res.render('sellerHome/sellerHomeMain.ejs');
};

exports.postGarageSale = async (req, res) => {
  try {
    const { title, description, location, date, time } = req.body;

    // Extract the year, month, and day from the date input
    const [year, month, day] = date.split('-');

    // Create the parsed date using the year, month, and day
    const parsedDate = moment(`${year}-${month}-${day}`).toDate();

    // Create the new post with the parsed date
    const newPost = new Post({
      title,
      description,
      location,
      date: parsedDate,
      time,
      userID: req.user._id
    });

    // Save the new post to the database
    await newPost.save();

    res.redirect('/api/post/sellerHome');
  } catch (error) {
    console.error(error);
  }
};



exports.getAllPosts = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const PAGE_SIZE = 5;
    const page = parseInt(req.query.page || 1);

    const skipPosts = (page - 1) * PAGE_SIZE;

    const garageSales = await Post.find({ date: { $gte: today } })
      .skip(skipPosts)
      .limit(PAGE_SIZE)
      .populate('userID');

    const numOfPosts = await Post.countDocuments({ date: { $gte: today } });
    const totalPages = Math.ceil(numOfPosts / PAGE_SIZE);

    res.render('mainPage/mainPage.ejs', { garageSales, numOfPosts, currentPage: page, totalPages });
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
    const numOfPosts = garageSales.length;

    // Modify the date format for each garage sale
    const formattedGarageSales = garageSales.map(garageSale => ({
      ...garageSale.toObject(),
      formattedDate: garageSale.date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }));

    res.render('sellerHome/sellerHomeAllPosts.ejs', {
      garageSales: formattedGarageSales,
      isAuthenticated,
      numOfPosts
    });
  } catch (error) {
    console.log(error);
  }
};


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

      // Extract the year, month, and day from the date input
      const [year, month, day] = req.body.date.split('-');

      // Create the parsed date using the year, month, and day
      const parsedDate = moment(`${year}-${month}-${day}`).toDate();
      postToEdit.date = parsedDate;

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






