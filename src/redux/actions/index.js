const setAudioPlayBtn = (data) => {
    return {
        type:'setAudioPlayBtn',
        value:data
    }
}
const setAudioFlag = (data) => {
    return {
        type:'setAudioFlag',
        value:data
    }
}
const setAudioInfo = (SongInfo,SongList) => {
    return {
        type:'setAudioInfo',
        SongInfo:SongInfo,
        SongList:SongList
    }
}
const setSongInfo = (SongInfo) => {
    return {
        type:'setSongInfo',
        value:SongInfo,
    }
}
module.exports = {
    setAudioPlayBtn,setAudioFlag,setAudioInfo,setSongInfo
}