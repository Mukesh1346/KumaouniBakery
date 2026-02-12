const mongoose = require("mongoose")

const SecondSubCategorySchema = new mongoose.Schema({
    mainCategoryId: {
        type: mongoose.Schema.ObjectId,
        ref: "Main-Category",
        required: true
    },
    subCategoryId: {
        type: mongoose.Schema.ObjectId,
        ref: "Subcategory",
        required: true
    },
    image: {
        type: String,
    },
    secondsubcategoryName: {
        type: String,
        required: true
    },
    ActiveonHome: {
        type: Boolean,
        default: false
    },
    innersubcategoryExit: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const Subcategory = mongoose.model("SecondSubcategory", SecondSubCategorySchema)

module.exports = Subcategory