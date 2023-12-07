import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import Navbar from './components/Navigationbar'
import NewItem from './components/NewItem'
import SummaryView from './components/SummaryView'
import WelcomeMessage from './components/WelcomeMessage'
import axios from 'axios'

// New wrapper component to include Router and logic
const AppWrapper = () => {
  const [products, setProducts] = useState([])
  const location = useLocation()

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/products')
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  return (
    <div className="App">
      <Navbar />
      {location.pathname === '/' && <WelcomeMessage />}
      <Routes>
        <Route
          path="/new"
          element={<NewItem fetchProducts={fetchProducts} />}
        />
        <Route
          path="/summary"
          element={
            <SummaryView products={products} fetchProducts={fetchProducts} />
          }
        />
      </Routes>
    </div>
  )
}

// Use the AppWrapper as the main component
const App = () => {
  return (
    <Router>
      <AppWrapper />
    </Router>
  )
}

export default App
