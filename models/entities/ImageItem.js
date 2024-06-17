const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ImageItemSchema = new mongoose.Schema({
    imageItemId: {
        type: String, 
        required: true,
        index: { unique: true }
    },
    imageItemLink: {
        type: String,
        index:{unique:false},
    },
    category: {
        type: String,
        index:{unique:false},
    },
    status: {
        type: Number,
        index:{unique:false},
        default: 1
    },
    createTime: {
        type: Date,
        required: true,
        index:{unique:false},
        default: new Date()
    },
    updateTime: {
        type: Date,
        required: true,
        index:{unique:false},
        default: new Date()
    },
    remark: {
        type:String,
        index:{unique:false}
    },
});
ImageItemSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('ImageItem', ImageItemSchema);