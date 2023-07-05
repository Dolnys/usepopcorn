import React from 'react'
import ReactDOM from 'react-dom/client'
import StarRating from './StarRating'
// import './index.css'
// import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <StarRating maxRating={5} />
    <StarRating
      maxRating={3}
      size={25}
      messages={['ok', 'good', 'cool']}
      defaultRating={1}
    />
  </React.StrictMode>
)
