const Post = require('../models/postModel')
const Yard = require('../models/yardModel')
const Email = require('../models/emailModel')
const moment = require('moment');

// displays new customer form -- added after
exports.displayNewListingForm = (req, res) => {
  console.log('end point hit ok')
  res.render('sellerHome/add.ejs');
};

exports.displaySellerHomePage = (req, res) => {
  console.log('end point hit ok')
  res.render('sellerHome/sellerHomeMain.ejs');
};

// Handle the form submission
exports.userSubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    // Create a new instance of the Email model
    const newEmail = new Email({ email });

    // Save the email to the database
    await newEmail.save();

    // Send a response indicating success
    console.log('success');
    res.render('landingPage/landingPage.ejs', { alertMessage: 'Thank you! You are subscribed successfully!' });
  } catch (error) {
    // Handle any errors
    res.status(500).send('An error occurred');
  }
};


exports.postGarageSale = async (req, res) => {
  try {

    const { title, description, address, date, time } = req.body;

    // Extract the year, month, and day from the date input
    const [year, month, day] = date.split('-');

    // Create the parsed date using the year, month, and day
    const parsedDate = moment(`${year}-${month}-${day}`).toDate();

    // Create the new post with the parsed date
    const newYard = new Yard({
      title,
      description,
      address,
      date: parsedDate,
      time,
      userID: req.user._id
    });

    // Save the new post to the database
    await newYard.save();

    res.redirect('/api/post/sellerHome');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};
// next 2 controllers are new / delete from here

exports.displayPostOnMap = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yardSales = await Yard.find({
      date: { $gte: today }
    }).populate('userID', 'userName'); // Only populate the 'userName' field

    const sanitizedYardSales = yardSales.map(yardSale => ({
      location: yardSale.location,
      title: yardSale.title,
      description: yardSale.description,
      date: yardSale.date,
      time: yardSale.time
    }));

    return res.status(200).json({
      success: true,
      count: sanitizedYardSales.length,
      data: sanitizedYardSales
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};




exports.getAllPosts = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day
    const numOfPosts = await Yard.countDocuments({ date: { $gte: today } });
    res.render('mainPage/index.ejs', { numOfPosts: numOfPosts })
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
}


// exports.getAllPosts = async (req, res) => {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const PAGE_SIZE = 5;
//     const page = parseInt(req.query.page || 1);

//     const skipPosts = (page - 1) * PAGE_SIZE;

//     const garageSales = await Post.find({ date: { $gte: today } })
//       .skip(skipPosts)
//       .limit(PAGE_SIZE)
//       .populate('userID');

//     const numOfPosts = await Post.countDocuments({ date: { $gte: today } });
//     const totalPages = Math.ceil(numOfPosts / PAGE_SIZE);

//     res.render('mainPage/mainPage.ejs', { garageSales, numOfPosts, currentPage: page, totalPages });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Server Error');
//   }
// };

//new 

exports.displaySellerHomeAllPosts = async (req, res) => {
  try {
    const isAuthenticated = req.isAuthenticated();
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day
    const numOfPosts = await Yard.countDocuments({ date: { $gte: today } });
    res.render('sellerHome/sellersAllPostsView.ejs', { numOfPosts: numOfPosts })
  } catch (error) {
    console.log(error)
  }
}



// exports.displaySellerHomeAllPosts = async (req, res) => {
//   try {
//     const isAuthenticated = req.isAuthenticated();
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const PAGE_SIZE = 5;
//     const page = parseInt(req.query.page || 1);

//     const skipPosts = (page - 1) * PAGE_SIZE;

//     const garageSales = await Post.find({ date: { $gte: today } })
//       .skip(skipPosts)
//       .limit(PAGE_SIZE)
//       .populate('userID');

//     // const garageSales = await Post.find({ date: { $gte: today } }).populate('userID');
//     const numOfPosts = await Post.countDocuments({ date: { $gte: today } });

//     const totalPages = Math.ceil(numOfPosts / PAGE_SIZE);

//     // Modify the date format for each garage sale
//     const formattedGarageSales = garageSales.map(garageSale => ({
//       ...garageSale.toObject(),
//       formattedDate: garageSale.date.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       })
//     }));

//     res.render('sellerHome/sellerHomeAllPosts.ejs', {
//       garageSales: formattedGarageSales,
//       isAuthenticated,
//       numOfPosts,
//       currentPage: page, 
//       totalPages
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };


exports.displaySellerHomePage = async (req, res) => {
  try {
    const userId = req.user._id;
    const sellersPosts = await Yard.find({ userID: userId }).populate('userID');
    res.render('sellerHome/sellerHomeMain.ejs', { sellersPosts: sellersPosts });
  } catch (error) {
    console.error(error);
  }
};


exports.displayEditForm = async (req, res) => {
  try {
    const userId = req.params.id;
    const filter = { _id: userId };
    const sellersPosts = await Yard.find(filter);
    const postToEdit = await Yard.findById(req.params.id);

    if (!postToEdit) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    res.render('sellerHome/edit.ejs', { sellersPosts: sellersPosts, postToEdit: postToEdit });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.updatePost = async (req, res) => {
  try {
    const postToEdit = await Yard.findById(req.params.id);
    if (postToEdit) {
      postToEdit.title = req.body.title || postToEdit.title;
      postToEdit.description = req.body.description || postToEdit.description;
      postToEdit.address = req.body.address || postToEdit.address; // Add this line

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


exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const postToDelete = await Yard.findOneAndRemove({ _id: postId, userID: userId });

    if (postToDelete) {
      res.redirect('/api/post/sellerHome');
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};








