const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModelSchema = new Schema({
    // Basic Information
    name: {
        type: String,
        required: true,
        trim: true
    },
    modelDescription: {
        type: String,
        // required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    images: [{
        type: String,
        required: true
    }],

    // Description Tab Content
    description: {
        mainHeading: {
            type: String,
            required: false
        },
        subHeading: {
            type: String,
            required: false
        },
        mainContent: {
            type: String,
            required: true
        },
        highlightBox: {
            title: {
                type: String,
                required: false
            },
            content: {
                type: String,
                required: false
            }
        },
    },

    // Features Tab Content
    features: {
        heading: {
            type: String,
            required: false
        },
        subHeading: {
            type: String,
            required: false
        },
        mainContent: {
            type: String,
            required: true
        },
        items: [{
            title: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
          
        }]
    },

    // Specifications Tab Content
    specifications: {
        heading: {
            type: String,
            required: false
        },
        introText: {
            type: String,
            required: false
        },
        // Fully dynamic specifications
        specs: [{
            title: {
                type: String,
                required: true
            },
            value: {
                type: String,
                required: true
            },
            
        }]
    },


    isActive: {
        type: Boolean,
        default: true
    },


}, { timestamps: true });



module.exports = mongoose.model('Model', ModelSchema);