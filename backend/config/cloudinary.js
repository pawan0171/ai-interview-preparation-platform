const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Check if Cloudinary is configured
const isCloudinaryConfigured = () => {
  const name = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;

  return (
    name && name !== 'your_cloudinary_cloud_name_here' && name.trim() !== '' &&
    key && key !== 'your_cloudinary_api_key_here' && key.trim() !== '' &&
    secret && secret !== 'your_cloudinary_api_secret_here' && secret.trim() !== ''
  );
};

// Configure Multer memory storage (allows us to parse PDF and upload to Cloudinary/local)
const storage = multer.memoryStorage();

// File filter to allow only PDFs
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== '.pdf') {
    return cb(new Error('Only PDF resumes are allowed'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

/**
 * Upload buffer to Cloudinary or write to local file system
 */
const saveFile = async (file) => {
  const fileName = `${Date.now()}-${file.originalname}`;
  
  if (isCloudinaryConfigured()) {
    console.log('[Upload Service] Uploading to Cloudinary...');
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          public_id: `resumes/${path.parse(fileName).name}`,
          format: 'pdf'
        },
        (error, result) => {
          if (error) {
            console.error(`[Upload Service Error] Cloudinary upload failed: ${error.message}`);
            return reject(error);
          }
          resolve({
            url: result.secure_url,
            fileName: file.originalname
          });
        }
      );
      uploadStream.end(file.buffer);
    });
  } else {
    console.log('[Upload Service] Cloudinary not configured. Falling back to local storage.');
    
    // Create backend/uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, fileName);
    
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, file.buffer, (err) => {
        if (err) {
          console.error(`[Upload Service Error] Local write failed: ${err.message}`);
          return reject(err);
        }
        resolve({
          url: `/uploads/${fileName}`,
          fileName: file.originalname
        });
      });
    });
  }
};

module.exports = { upload, saveFile };
