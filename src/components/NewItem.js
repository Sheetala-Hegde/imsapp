import React, { useState, useEffect } from 'react'
import './NewItem.css'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'

const NewItem = ({ fetchProducts }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    quantity: '',
    price: '',
  })

  const [formErrors, setFormErrors] = useState({
    name: '',
    description: '',
    quantity: '',
    price: '',
  })

  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(false)
  const [isReadOnly, setIsReadOnly] = useState(false)

  useEffect(() => {
    if (location.state?.selectedProduct) {
      const {
        Name,
        Description,
        Category,
        Quantity,
        Price,
      } = location.state.selectedProduct
      setFormData({
        name: Name,
        description: Description,
        category: Category,
        quantity: Quantity,
        price: Price,
      })

      setIsSaveButtonDisabled(location.state.disableSaveButton)
      setIsReadOnly(location.state.disableSaveButton)
    }
  }, [location.state])

  // Handle form input changes
  const handleChange = (e) => {
    if (!isReadOnly) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      })

      // Clear the corresponding error when the user types
      setFormErrors({
        ...formErrors,
        [e.target.name]: '',
      })
    }
  }

  // Validate the form before submission
  const validateForm = () => {
    const errors = {}

    // Validate 'name'
    if (!/^[a-zA-Z\s]{1,20}$/.test(formData.name.trim())) {
      errors.name = 'Name should be in characters'
    }

    // Validate 'description'
    if (!/^[a-zA-Z\s]{1,50}$/.test(formData.description.trim())) {
      errors.description = 'Description should be up to 50 characters in length'
    }

    // Validate 'quantity'
    if (!/^[1-9]\d*$/.test(formData.quantity)) {
      errors.quantity = 'Quantity should be a positive integer'
    }

    // Validate 'price'
    if (!/^\d+(\.\d+)?$/.test(formData.price) || Number(formData.price) <= 0) {
      errors.price = 'Price should be a positive number'
    }

    setFormErrors(errors)

    // Return true if there are no errors, indicating the form is valid
    return Object.keys(errors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate the form before submitting
    if (!validateForm()) {
      // If the form is not valid, do not proceed with submission
      return
    }

    try {
      const formDataWithNumbers = {
        Name: formData.name,
        Description: formData.description,
        Category: formData.category,
        Quantity: parseInt(formData.quantity, 10),
        Price: parseFloat(formData.price),
      }

      if (location.state?.selectedProduct) {
        // If selectedProduct is present in location state, update the existing product
        await axios.put(
          `http://localhost:5000/products/${location.state.selectedProduct._id}`,
          formDataWithNumbers,
        )
      } else {
        // If selectedProduct is not present, add a new product
        await axios.post('http://localhost:5000/products', formDataWithNumbers)
      }

      fetchProducts()

      setFormData({
        name: '',
        description: '',
        category: '',
        quantity: 0,
        price: 0,
      })

      navigate('/summary')
    } catch (error) {
      console.error('Error creating/updating product:', error)

      if (error.response) {
        console.error('Response data:', error.response.data)
        console.error('Response status:', error.response.status)
        console.error('Response headers:', error.response.headers)
      } else if (error.request) {
        console.error('No response received. Request:', error.request)
      } else {
        console.error('Error setting up the request:', error.message)
      }
    }
  }

  // Handle cancel button click
  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      quantity: '',
      price: '',
    })
  }

  return (
    <div className="new-item-container">
      <div className="form-box">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">
              Name:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`${formErrors.name || isReadOnly ? 'error' : ''}`}
              disabled={isReadOnly}
            />
            {formErrors.name && (
              <div className="error-message">{formErrors.name}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className={`${
                formErrors.description || isReadOnly ? 'error' : ''
              }`}
              disabled={isReadOnly}
            />
            {formErrors.description && (
              <div className="error-message">{formErrors.description}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="category">Category:&nbsp;&nbsp; </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              disabled={isReadOnly}
            >
              <option value="">
                Select Category&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </option>
              <option value="Electronics">Electronics</option>
              <option value="Stationary">Stationary</option>
              <option value="Clothings">Clothings</option>
              <option value="sports-item">Sports Item</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity: &nbsp;&nbsp;&nbsp;</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              className={`${formErrors.quantity || isReadOnly ? 'error' : ''}`}
              disabled={isReadOnly}
            />
            {formErrors.quantity && (
              <div className="error-message">{formErrors.quantity}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="price">
              Price:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className={`${formErrors.price || isReadOnly ? 'error' : ''}`}
              disabled={isReadOnly}
            />
            {formErrors.price && (
              <div className="error-message">{formErrors.price}</div>
            )}
          </div>

          <div className="button-group">
            <button
              type="button"
              className="cancel-button"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`save-button ${
                isSaveButtonDisabled ? 'disabled' : ''
              }`}
              disabled={isSaveButtonDisabled}
            >
              Save
              {isSaveButtonDisabled && (
                <span
                  className="disabled-indicator"
                  role="img"
                  aria-label="Disabled"
                ></span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewItem
