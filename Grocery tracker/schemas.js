const productSchema = new mongoose.Schema({
    id: Number,
    name: String,
    bestBefore: Date,
    remain: String
});

const Product = mongoose.model('Product', productSchema);