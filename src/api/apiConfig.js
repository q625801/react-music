import axios from 'axios'
// import * as common from './common'
axios.defaults.withCredentials = true
var instance = axios.create({
  timeout: 300000
})

instance.interceptors.request.use(config => {
    // let token = common.getCookie("token");
    // if (token) {
    //   config.headers['Content-Type'] = 'application/json;charset=utf-8'
    //   config.headers.Authorization = `Bearer ${token}`
    // } 
    return config
})


const post_json = (url, params) => {
    var p = {};
    if (params instanceof Object) {
      p = params;
    }
    return instance({
      headers: {
        'Content-Type': "application/json;charset=utf-8"
      },
      params: p,
      method: 'post',
      url: url
    })
}
const get_json = (url, params) => {
  var p = {};
  if (params instanceof Object) {
    p = params;
  }
  return instance({
    headers: {
      'Content-Type': "application/json;charset=utf-8"
    },
    params: p,
    method: 'get',
    url: url
  })
}
export const postJson = (url, params, successCallback, errorCallback,isloading = true) => {
  if (isloading){
      // store.state.loadding = true;
  }
  
  post_json(url, params)
      .then(res => successDataFun(res, successCallback, isloading))
      .catch(err => failDataFun(err, errorCallback, isloading));
}
export const getJson = (url, params, successCallback, errorCallback,isloading = true) => {
  if (isloading){
      // store.state.loadding = true;
  }
  
  get_json(url, params)
      .then(res => successDataFun(res, successCallback, isloading))
      .catch(err => failDataFun(err, errorCallback, isloading));
}
const successDataFun = (res, successCallback, isloading) => {
  if (isloading) {
      // store.state.loadding = false;
  }
  // let ret = res.data

  if(successCallback){
      successCallback(res)
  }

  // let state = parseInt(ret.state);
  // switch (state) {
  //     case 6001: //账号密码错误
      
  //     break
  // default:
  //     if(successCallback){
  //         successCallback(res)
  //     }
  //     break
  // }
}
const failDataFun = (err, errorCallback, isloading) => {
  if (isloading) {
      // store.state.loadding = false;
  }
  // let ret = err.data
  if(errorCallback){
      errorCallback(err)
  }
  // let state = parseInt(ret.state);
  // switch (state) {
  // case 6001: //账号密码错误
      
  //     break
  // default:
  //     if(errorCallback){
  //         errorCallback(err)
  //     }
  //     break
  // }
}
