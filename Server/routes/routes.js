const express = require('express')
const router = express.Router()
const ProductModel = require('../models/ProductModel')
const axios = require('axios')

router.post('/', async (req, res, next) => {
  try {
    const newProduct = await ProductModel.create(req.body)
    res.status(201).json(newProduct)
  } catch (error) {
    console.error('Error creating product:', error)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message })
    }
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

router.get('/', async (req, res, next) => {
  try {
    const allProducts = await ProductModel.find()
    res.status(200).json(allProducts)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const singleProduct = await ProductModel.findById(req.params.id)
    if (!singleProduct) {
      res.status(404).json({ error: 'not found' })
    }
    res.status(200).json(singleProduct)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const updateProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    )
    if (!updateProduct) {
      res.status(404).json({ error: 'not found' })
    }
    res.status(200).json(updateProduct)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(req.params.id)
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router
