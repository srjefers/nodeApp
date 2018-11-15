const mongose = require('mongoose');

const schema =  mongose.Schema;

const postSchema = new schema({
    author: String,
    title: String,
    description: String,
    imageUrl: String,
    status: {
        type: Boolean,
        default: true
    }
});

module.exports = mongose.model('sendData', postSchema);