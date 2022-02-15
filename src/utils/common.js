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