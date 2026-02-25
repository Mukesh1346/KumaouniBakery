const mongoose = require("mongoose")

const VariantSchema = new mongoose.Schema({
    // weight: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "Size",
    //     default: null
    // },

    weight: {
        type: String,
        default: ''
    },
    flover: {
        type: mongoose.Schema.ObjectId,
        ref: "Flover",
        default: null
    },
    price: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number,
        default: 0
    },
    finalPrice: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        default: 0
    }
});

const productSchema = new mongoose.Schema({
    categoryName: {
        type: mongoose.Schema.ObjectId,
        ref: "Main-Category",
        required: true
    },
    subcategoryName: {
        type: mongoose.Schema.ObjectId,
        ref: "Subcategory",
        required: true
    },
    secondsubcategoryName: {
        type: mongoose.Schema.ObjectId,
        ref: "SecondSubcategory",
        required: true
    },
    recommendedProductId: [{
        type: mongoose.Schema.ObjectId,
        ref: "RecommendedProduct",
        default: null
    }],
    productName: {
        type: String,
        required: true,
    },
    productDescription: {
        type: String,
        required: true,
    },
    productDetails: {
        type: String,
        required: true,
    },
    Variant: {
        type: [VariantSchema],
        required: true,
    },
    productImage: {
        type: [String],
        required: true
    },
    ActiveonHome: {
        type: Boolean,
        default: false
    },
    FeaturedProducts: {
        type: Boolean,
        default: false
    },
    BestSellingProduct: {
        type: Boolean,
        default: false
    },
    eggless: {
        type: Boolean,
        default: false
    },
})


const Product = mongoose.model("Product", productSchema)

module.exports = Product