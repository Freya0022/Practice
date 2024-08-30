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
    category: String,
    tags: { type: [String], default: [] }
});

const Product = mongoose.model('Product', productSchema);


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'/views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function calculateRemaining(bestBeforeDate) {
    const currentDate = moment();
    const bestBefore = moment(bestBeforeDate);

    const daysRemaining = bestBefore.diff(currentDate, 'days');
    const monthsRemaining = bestBefore.diff(currentDate, 'months');

    return {
        days: daysRemaining,
        months: monthsRemaining
    };
}

app.get('/',(req,res) => {
    const categories = ["Drink", "Frozen", "Liquor", "Household", "Pantry", "Pet Foods"];
    res.render('home.ejs',{categories})
})



app.post('/toggleTagColor/:id', async (req, res) => {
    const { id } = req.params;
    const { tag } = req.body;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Ensure `tag` is valid (e.g., not null)
        if (tag === null || tag === undefined) {
            return res.status(400).json({ success: false, message: 'Invalid tag value' });
        }

        // Toggle tag logic
        const tags = product.tags || [];
        const tagIndex = tags.indexOf(tag);

        if (tagIndex > -1) {
            tags.splice(tagIndex, 1); // Remove the tag
        } else {
            tags.push(tag); // Add the tag
        }

        product.tags = tags;
        await product.save();

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error updating tag' });
    }
});

app.get('/category/:category', async(req, res) => {
    const category = req.params.category;
    const sortOrder = req.query.sort || 'asc';
    const categories = ["Drink", "Frozen", "Liquor", "Household", "Pantry", "Pet Foods"];
    let products = await Product.find({ category });
    products = products.map(product => {
        const { days, months } = calculateRemaining(product.bestBefore);
        return {
            ...product.toObject(),
            remainDays: days,
            remainMonths: months,
        };
    });

    // Sort products by remaining days (numeric value)
    products.sort((a, b) => {
        return sortOrder === 'asc' ? a.remainDays - b.remainDays : b.remainDays - a.remainDays;
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