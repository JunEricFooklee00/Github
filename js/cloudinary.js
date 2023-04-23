const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: "dpsarrelo",
    api_key:  "378989546971825",
    api_secret: "oUP5AxliCqtYnydvs82lsyPv-T0"
});

module.exports.key = cloudinary; 