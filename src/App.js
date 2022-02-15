import './assets/css/App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './page/home'
import Login from './page/Login/Login'

//redux
// import { Provider } from 'react-redux'
// import { createStore, applyMiddleware, compose } from 'redux'
// import thunkMiddleware from 'redux-thunk'
// import rootReducer from 'reducers'
// const store = createStore(
//   rootReducer,
//   compose(applyMiddleware(thunkMiddleware)),
// )
//redux

function App() {
  return (
    <div className="App">
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
        </Routes>
      </div>
  );
}

export default App;
