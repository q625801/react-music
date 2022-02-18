import './assets/css/App.css';
import { BrowserRouter as Router, Routes, Route  } from "react-router-dom";
import Home from './page/home'
import Audio from "./page/components/audio/audio"
import SheetDetail from './page/sheetdetail/sheetdetail'
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
          <Route path='/sheetdetail' element={<SheetDetail/>}/>
        </Routes>
        <Audio/>
      </div>
  );
}

export default App;
