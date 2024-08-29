const express = require('express');
const app = express();
const path = require('path');
const moment = require('moment');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/groceryTracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB!");
}).catch(err => {
    console.error("Connection error", err);
});

const productSchema = new mongoose.Schema({
    name: String,
    bestBefore: Date,
    remain: String,
    category: String
});

const Product = mongoose.model('Product', productSchema);


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'/views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

function calculateRemaining(bestBeforeDate) {
    const currentDate = moment();
    const bestBefore = moment(bestBeforeDate);

    const daysRemaining = bestBefore.diff(currentDate, 'days');
    const monthsRemaining = bestBefore.diff(currentDate, 'months');

    if (daysRemaining > 30) {
        return `${monthsRemaining} month${monthsRemaining > 1 ? 's' : ''}`;
    } else {
        return `${daysRemaining} day${daysRemaining > 1 ? 's' : ''}`;
    }
}

app.get('/',(req,res) => {
    const categories = ["Drink", "Frozen", "Liquor", "Household", "Pantry", "Pet Foods"];
    res.render('home.ejs',{categories})
})

app.get('/category/:category', async(req, res) => {
    const category = req.params.category;
    const categories = ["Drink", "Frozen", "Liquor", "Household", "Pantry", "Pet Foods"];
    const products = await Product.find({ category });
    products.forEach(product => {
        product.remain = calculateRemaining(product.bestBefore);
    });
    res.render('categories/category', { category, categories,products, moment});
});

app.get('/add/:category', (req, res) => {
    const category = req.params.category; 
    const categories = ["Drink", "Frozen", "Liquor", "Household", "Pantry", "Pet Foods"];
    res.render('categories/add', { category, categories });
});

app.post('/add/:category', (req, res) => {
    const category = req.params.category;
    const { name, bestBefore } = req.body;
    const newProduct = new Product({
        name,
        bestBefore,
        remain: calculateRemaining(bestBefore),
        category 
    });
    newProduct.save().then(() => {
        res.redirect(`/category/${category}`);
    }).catch(err => {
        console.error(err);
        res.status(500).send("Error saving product");
    });
});

app.get('/edit/:category/:id', async (req, res) => {
    const { id, category } = req.params;
    const categories = ["Drink", "Frozen", "Liquor", "Household", "Pantry", "Pet Foods"];
    const product = await Product.findById(id);
    res.render('categories/edit', { category, categories,product });
});

app.post('/edit/:category/:id', async (req, res) => {
    const { id, category } = req.params;
    const { name, bestBefore } = req.body;
    const remain = calculateRemaining(bestBefore);

    await Product.findByIdAndUpdate(id, { name, bestBefore, remain });
    res.redirect(`/category/${category}`);
});

app.post('/delete/:category/:id', async(req, res) => {
    const { category, id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect(`/category/${category}`);
});

app.listen(3000, () => {
    console.log("Running")
})