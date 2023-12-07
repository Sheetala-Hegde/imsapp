import React, { useEffect, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import './SummaryView.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const SummaryView = () => {
  const [rowData, setRowData] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const columnDefs = [
    { headerName: 'Name', field: 'Name', width: 170 },
    { headerName: 'Description', field: 'Description', width: 200 },
    { headerName: 'Category', field: 'Category', width: 170 },
    { headerName: 'Quantity', field: 'Quantity', width: 170 },
    { headerName: 'Price', field: 'Price', width: 170 },
    {
      headerName: 'Action',
      cellRenderer: (params) => (
        <div>
          <button
            className="blue-buttono"
            onClick={() => handleOpenClick(params.data._id)}
          >
            <FontAwesomeIcon icon={faEye} />
          </button>

          <button
            className="blue-button"
            onClick={() => handleEditClick(params.data._id)} // Use handleEditClick for Edit
          >
            <FontAwesomeIcon icon={faPen} />
          </button>
          <button
            className="red-button"
            onClick={() => handleDelete(params.data._id)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      ),
      width: 150,
    },
  ]

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  }

  const handleEditClick = (productId) => {
    const selectedProduct = rowData.find((product) => product._id === productId)
    navigate('/new', { state: { selectedProduct, disableSaveButton: false } })
  }

  const handleOpenClick = (productId) => {
    const selectedProduct = rowData.find((product) => product._id === productId)
    navigate('/new', { state: { selectedProduct, disableSaveButton: true } })
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await axios.get('http://localhost:5000/products')
      setRowData(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    console.log('rowData state:', rowData)
  }, [rowData])

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/products/${productId}`)
      fetchProducts() // Call the function to refetch data after deletion
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div className="summary-container">
      <div
        className="ag-theme-alpine"
        style={{ height: '300px', width: '80%' }}
      >
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          defaultColDef={defaultColDef}
        />
      </div>

      <div className="icon-meaning">
        <div className="icon">
          <FontAwesomeIcon icon={faEye} />
        </div>
        <div className="meaning">View</div>
        <div className="icon">
          <FontAwesomeIcon icon={faPen} />
        </div>
        <div className="meaning">Update</div>
        <div className="icon">
          <FontAwesomeIcon icon={faTrash} />
        </div>
        <div className="meaning">Delete</div>
      </div>
    </div>
  )
}

export default SummaryView
