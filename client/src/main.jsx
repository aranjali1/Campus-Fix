import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js'

const stripePromise=loadStripe('pk_test_51RslfwFZ8Jc8rgQy07Jjh6ToK7TTk7YibMFSfmyJrrLAjRjvxeSoNNq0KEfMVUGqcHiVRjCmmfSABa28Erj7LDVn00m68e5G6m');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </BrowserRouter>
  </StrictMode>,
)
