

const firebaseAdmin = require('../../config/firebaseSdk/adminsdk');



var authManagerModel = {
    createCustomToken: (data,callback) =>{
        firebaseAdmin.auth().createCustomToken(data.uid) // Mint token using Firebase Admin SDK
            .then(customToken =>{ //Response must be an object or Firebase errors
                callback(null, {customToken});
            })
            .catch(function(err) {
                callback(err, null);
            });
    },

}

module.exports = authManagerModel;