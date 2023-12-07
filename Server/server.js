const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors') // Import the cors middleware
const ProductModel = require('./models/ProductModel')
const productRoutes = require('./routes/routes')

const app = express()

// Enable CORS for all routes
app.use(cors())

app.use(express.json())
app.use('/products', productRoutes)

mongoose.connect('mongodb://localhost:27017/imsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const PORT = 5000
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
