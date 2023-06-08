const multer = require('multer');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Specify the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()); // Generate a unique filename for each uploaded file
  }
});

// Create the Multer instance
const upload = multer({ storage: storage });

// Apply the upload middleware to the appropriate route
router.post('/garageSale', upload.array('images', 5), postController.postGarageSale);
