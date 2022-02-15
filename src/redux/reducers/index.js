const initState = {
    //播放器
    audioInfo:{
        audioFlag:false,//是否显示音频播放器
        audioPlayBtn:false,//播放器开始按钮状态
        SongInfo:{//当前正在播放的音乐数据
            SongId:'',
            SongName:'',
            SongPic:'',
            SongArtists:''
        },
        SongListFlag:false,
        SongList:[],//播放列表数据
    },
    //播放器end
}
const reducer = (state = initState,action) => {
    console.log("reducer：",state,action)
    switch (action.type) {
        case 'send_audioFlag':
            state.audioInfo.audioFlag = action.value
            // return Object.assign({},state,action)
        case 'setAudioPlayBtn':
            state.audioInfo.audioPlayBtn = action.value
        default:
            return state
    }
}
module.exports = {
    reducer
}