const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { Storage } = require('@google-cloud/storage');

// 初始化雲端
const storage = new Storage({
  keyFilename: 'F:/googleSDK/graphic-charter-435810-k9-6d097b49fa5f.json'
});

const bucketName = 'nick_product_bucket';
const bucket = storage.bucket(bucketName);

//設置存儲

const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

router.post('/', upload.single('image'), async(req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  //上傳到 Google Cloud Storage
  const blob = bucket.file(Date.now() + path.extname(req.file.originalname));
  const blobStream = blob.createWriteStream({
    resumable: false,
  });

  blobStream.on('error', (err) => {
    console.error('Upload error:', err);
    res.status(500).send('Upload error');
  });

  blobStream.on('finish', () => {
    // Make the file publicly accessible
    blob.makePublic().then(()=>{
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
      res.json({ imagePath: publicUrl });
    }).catch(err=>{
      console.error('Make public error:', err);
      res.status(500).send('Error making file public');
    })
  });

  blobStream.end(req.file.buffer);

});

module.exports = router;
