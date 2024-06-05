import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'

import negocios from './reducers/negocios'

const reducer = combineReducers({
  negocios: negocios.reducer
})

const store = configureStore({reducer})

export default store