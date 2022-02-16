import store from "../redux/store"
import {setAudioInfo} from "../redux/actions"
export const SongArtistsComputed = (data) => {
    if(data.length === '1'){
        return data[0].name
    }else{
        let name = data.map(obj => {
            return obj.name
        }).join(' / ')
        return name
    }
}
export const minutes = (times) => {
    var minutes = Math.floor(times / (1000 * 60)) % 60; //计算剩余的分钟
    if (minutes < 10) {
      return "0" + minutes;
    } else {
      return minutes;
    }
  }
export const seconds = (times) => {
    var seconds = Math.floor(times / 1000) % 60; //计算剩余的秒数
    if (seconds < 10) {
      return "0" + seconds;
    } else {
      return seconds;
    }
}
export const playtime = (time) => {
    return minutes(time) + ":" + seconds(time)
}
export const audioPlay = (SongInfo,SongList) => {
  let data = {
      SongId:SongInfo.id,
      SongName:SongInfo.name,
      SongPic:SongInfo.picUrl,
      SongArtists:SongArtistsComputed(SongInfo.song.artists)
  }
  let arr = [];
  if(SongList && SongList.length > 0){
    SongList.forEach((item,index) => {
      let obj = {}
      obj.SongId = item.id
      obj.SongName = item.name
      obj.SongPic = item.picUrl
      obj.SongArtists = SongArtistsComputed(item.song.artists)
      obj.SongTime = playtime(item.song.bMusic.playTime)
      arr.push(obj)
    })
  }
  store.dispatch(setAudioInfo(data,arr))
}
export const Shuffle = arr => {
  let res = [],random
  while (arr.length > 0) {
    random = parseInt(Math.random() * arr.length)
    res.push(arr.splice(random,1)[0])
  }
  return res
}
export const IsPC = () => {
  var userAgentInfo = navigator.userAgent;
  var Agents = ["Android", "iPhone",
     "SymbianOS", "Windows Phone",
     "iPad", "iPod"];
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
     if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false;
        break;
     }
  }
  return flag;
}