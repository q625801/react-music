import React from 'react'
import { Slider } from 'antd'
import 'antd/dist/antd.css'
import '../../../assets/css/audio.css'
import {mp3url,songlyric} from '../../../api/api'
import {postJson} from '../../../api/apiConfig'
import store from "../../../redux/store"
import {setAudioPlayBtn,setAudioFlag,setSongInfo} from "../../../redux/actions"
import {Shuffle,IsPC} from '../../../utils/common'
import Lyric from './lyric'
class audio extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            VolumeSize:100,
            audiostate:true,
            audioduration:'',
            playTime:'00:00',
            progressWidth:'',
            touch:{},
            checkplayfirst:true,
            is_yuanmousedown:false,
            volumeTitle:'静音',
            audioPlayMode:'loop',
            shuffleSongList:[],

            SongId:'',
            SongName:'',
            SongPic:'',
            SongArtists:'',

            LyricData:'',
        }
        this.audioplay = this.audioplay.bind(this)
        this.audioLyric = React.createRef();
    }
    componentDidMount(){
        this.audioTimeUpdate()
        let that = this
        store.subscribe(() => {
            // console.log(store.getState())
            let storeData = store.getState()
            that.getSongInfo(storeData)
            if(storeData.audioInfo.audioPlayBtn){
                that.refs.audio.play();
            }else{
                that.refs.audio.pause();
            }
        })
    }
    init(){
        //重置音频属性
        this.setState({
            audiostate: true,
            audioduration: '',
            playTime: '00:00',
            progressWidth: '',
            touch: {},
            checkplayfirst: true,
            is_yuanmousedown: false
        })
    }
    getmusicurl(id){
        postJson(mp3url,{id:id},(res) => {
          if(res.data.data[0].url != null){
            this.refs.audio.src = res.data.data[0].url;
          }else{
            // this.$message({message:'获取音源失败，自动跳转下一首！',customClass:'zZindex'});
            // if(this.$store.getters.getSongList.length == 1){
            //   this.$store.commit('setSongInfoInit')
            //   this.$store.commit('setAudioFlag',false)
            //   return
            // }
            // this.nextSong()
          }
        },(err) => {
  
        },false)
    }
    audioTimeUpdate () {
        let that = this;
        let audio = this.refs.audio;
        audio.autoplay = true;
        audio.addEventListener('timeupdate',function(){
          that.setTime()
          that.setLyric()
        });//监听播放时间
        audio.addEventListener("playing", function(){//监听播放
            that.setState({
                audiostate:false 
            })
        });
        audio.addEventListener("pause", function(){//监听暂停
            that.setState({
                audiostate:true 
            })
        });
        audio.addEventListener("ended", function(){//监听音频播放完毕
        //   that.refs.lyric.lineNo = 0
          if(that.state.audioPlayMode === 'loopone'){
            audio.play()
          }else{
            store.dispatch(setAudioPlayBtn(false))
            that.nextSong()
          }
        });
        audio.addEventListener("canplay", function(){//监听audio是否加载完毕，如果加载完毕，则读取audio播放时间
            that.setState({
                audioduration:that.refs.audio.duration
            })
            if(that.state.checkplayfirst){
                that.setState({
                    checkplayfirst:false
                })
                store.dispatch(setAudioPlayBtn(true))
            }
        });
    }
    setTime(){
        const audio = this.refs.audio
        let minutes,seconds
        if(audio.currentTime){
          minutes = Math.floor(audio.currentTime / 60)
          seconds = Math.floor(audio.currentTime - minutes * 60)
        }
        let minuteValue
        let secondValue
        // 进行格式转换，当分钟小于10的时候，在前面加0
        if (minutes < 10) {
          minuteValue = '0' + minutes
        } else {
          minuteValue = minutes
        }
        // 秒数的格式设置
        if (seconds < 10) {
          secondValue = '0' + seconds
        } else {
          secondValue = seconds
        }
        // 进行时间值拼接，展示到页面
        if(!minuteValue){
          minuteValue = "00"
        }
        if(!secondValue){
          secondValue = "00"
        }
        let audioTime = minuteValue + ':' + secondValue
        this.setState({
            playTime: audioTime
        })
        // // 进度条的长度计算
        let barLength = audio.currentTime / audio.duration * 100;
        if(!this.state.is_yuanmousedown){
          this.setProgress(barLength)
        }
    }
    setProgress (val) {
        if (val < 0 || val > 100) {
          return
        }
        this.setState({
            progressWidth: val
        })
    }
    audioplay(){
        let audio = this.refs.audio;
        if (audio.paused) {
            store.dispatch(setAudioPlayBtn(true))
        } else {
            store.dispatch(setAudioPlayBtn(false))
        }
    }
    volumeClick(){
        if(this.state.volumeTitle === '静音'){
          this.refs.audio.volume = 0
          this.setState({
            VolumeSize: 0,
            volumeTitle: '恢复音量'
          })
        }else{
          this.refs.audio.volume = 1
          this.setState({
            VolumeSize: 100,
            volumeTitle: '静音'
          })
        }
    }
    changeVolume = (value) => {
        this.setState({
            VolumeSize:value
        })
        this.refs.audio.volume = this.state.VolumeSize/100
    }
    comPlayMode(){
        if(this.state.audioPlayMode === 'loop'){
          return ''
        }else if(this.state.audioPlayMode === 'loopone'){
          return 'loopone'
        }else{
          return 'random'
        }
    }
    changePlayMode(){
        if(this.state.audioPlayMode === 'loop'){
            this.setState({
                audioPlayMode:'loopone'
            })
        }else if(this.state.audioPlayMode === 'loopone'){
            this.setState({
                audioPlayMode:'random'
            })
        }else{
            this.setState({
                audioPlayMode:'loop'
            })
        }
    }
    prevSong = () => {
        if(this.state.audioPlayMode === 'loop' || this.state.audioPlayMode === 'loopone'){
            let SongList = store.getState().audioInfo.SongList
            this.goPrevSong(SongList)
        }else{
            this.goPrevSong(this.state.shuffleSongList)
        }
    }
    goPrevSong = (arr = []) => {
        if(arr.length > 0){
            let SongOnIndex = arr.findIndex((v,i) => {
                return this.state.SongId === v.SongId
            })
            SongOnIndex--
            if(SongOnIndex === -1){
                SongOnIndex = arr.length - 1
            }
            store.dispatch(setSongInfo(arr[SongOnIndex]))
        }
        
    }
    nextSong = () => {
        if(this.state.audioPlayMode === 'loop' || this.state.audioPlayMode === 'loopone'){
            let SongList = store.getState().audioInfo.SongList
            this.goNextSong(SongList)
        }else if(this.state.audioPlayMode === 'random'){
            this.goNextSong(this.state.shuffleSongList)
        }
    }
    goNextSong = (arr = []) => {
        if(arr.length > 0){
            let SongOnIndex = arr.findIndex((v,i) => {
                return this.state.SongId === v.SongId
            })
            SongOnIndex++
            if(SongOnIndex === arr.length){
                SongOnIndex = 0
            }
            store.dispatch(setSongInfo(arr[SongOnIndex]))
        }
    }
    yuanmousedown = () => {
        if(!this.state.audioduration){
            return
        }
        this.setState({
            is_yuanmousedown:true
        })
        let offsetWidth;
        let that = this;
        document.onmousemove = (e) => {
            if (!that.state.is_yuanmousedown){
                return false;
            }
            const left = that.refs.barBg.offsetLeft
            that.setState({
                touch:{
                    startX: e.pageX - left,
                    width: that.refs.barBg.clientWidth
                }
            })
            if(IsPC()){
                let deltaX = e.pageX - left;
                const width = Math.min(Math.max(0, deltaX), that.state.touch.width)
                offsetWidth = width / that.state.touch.width * 100
            }
            that.setProgress(offsetWidth)
        };
        document.onmouseup = (ev) => {
            var that = this;
            if(that.state.is_yuanmousedown){
                that.setState({
                    is_yuanmousedown:false
                })
                that.changeTime(offsetWidth)
            }
        };
    }
    changeTime (time) {
        const audio = this.refs.audio
        const current = time * audio.duration / 100
        audio.currentTime = current
    }
    clickBg = (e) => {
        if(!this.state.audioduration){
            return
        }
        let left = this.refs.barBg.offsetLeft
        let offsetWidth
        this.setState({
            touch:{
                endX:e.pageX - left,
                width:this.refs.barBg.clientWidth
            }
        },() => {
            offsetWidth = this.state.touch.endX / this.state.touch.width * 100;
            this.changeTime(offsetWidth)
        })
        
    }
    //监听redux数据变化 -------start
    getSongInfo(newval){
        if(!newval.audioInfo.SongInfo.SongId){
            return
        }
        let that = this
        if(that.state.SongId === newval.audioInfo.SongInfo.SongId){
            return
        }
        this.setState({
            SongId: newval.audioInfo.SongInfo.SongId,
            SongName: newval.audioInfo.SongInfo.SongName,
            SongPic: newval.audioInfo.SongInfo.SongPic,
            SongArtists: newval.audioInfo.SongInfo.SongArtists,
            shuffleSongList:Shuffle(JSON.parse(JSON.stringify(store.getState().audioInfo.SongList)))
        },() => {
            this.init()
            if(!newval.audioInfo.audioFlag){
                store.dispatch(setAudioFlag(true))
            }
            this.getmusicurl(newval.audioInfo.SongInfo.SongId)
            this.getlyric(newval.audioInfo.SongInfo.SongId)
        })
    }
    //监听redux数据变化 -------end
    changelyricFlag = () => {
        this.audioLyric.current.changelyricFlag()
    }
    getlyric(id){
        postJson(songlyric,{id:id},(res) => {
            this.audioLyric.current.changelyricData({
                lyric:res.data.lrc.lyric,
                version:res.data.lrc.version
            })
            //网易云歌词version 参数 1:有时间 2.没时间
        },(err) => {
  
        },false)
    }
    setLyric(){
        if (this.audioLyric.current.lineNo == this.audioLyric.current.lyricData.length) return;
        this.audioLyric.current.setlineNo(this.audioLyric.current.getLineNo(this.refs.audio.currentTime));
        this.audioLyric.current.highLight();
    }
    render(){
        return(
            <div className="wrap audio-wrap sdwa" style={{display:store.getState().audioInfo.audioFlag ? 'block':'none'}}>
                <div className="player-bar">
                    <div className="avatar">
                        <img alt="nicemusic" src={this.state.SongPic + '?param=100y100'} title={this.state.SongName}/>
                    </div>
                    <div className="info">
                        <h2 className="ellipsis">{this.state.SongName}</h2>
                        <p className="ellipsis">{this.state.SongArtists}</p>
                    </div>
                    <div className="player-btn clear">
                        <span className="player-prev fl" onClick={this.prevSong}></span>
                        <span onClick={this.audioplay} className={['fl',this.state.audiostate ? 'player-play' : 'player-stop'].join(' ')}></span>
                        <span className="player-next fl" onClick={this.nextSong}></span>
                    </div>
                    <div id="progress-wrap" className="progress-wrap">
                        <p className="current-time">{this.state.playTime}</p>
                        <div className="progress-bar-wrap">
                            <div className="progress-bar" onMouseDown={this.clickBg} onTouchStart={this.clickBg} ref="barBg">
                                <div className="bar-inner">
                                    <div className="progress" style={{width:this.state.progressWidth + '%'}}></div>
                                    <div className="progress-btn" onMouseDown={this.yuanmousedown} ref="barBgyuan" style={{left:this.state.progressWidth + '%'}}></div>
                                </div>
                            </div>
                        </div>
                        <p className="duration-time"> {this.state.audioduration ? ((parseInt(this.state.audioduration / 60, 10) <= 9 ? '0' + parseInt(this.state.audioduration / 60, 10) : parseInt(this.state.audioduration / 60, 10)) + ':' + (parseInt(this.state.audioduration % 60) <= 9 ? '0' + parseInt(this.state.audioduration % 60) : parseInt(this.state.audioduration % 60))) : ''}</p>
                    </div>
                    <div className="volume-wrap">
                        <div title={this.state.volumeTitle} className={['volume-yl',this.state.VolumeSize == 0 ? 'off' : ''].join(' ')/*eslint-disable-line */} onClick={this.volumeClick.bind(this)}></div>
                        <div className='volume-slider'>
                            <Slider value={this.state.VolumeSize} onChange={this.changeVolume}/>
                        </div>
                    </div>
                    <div className="bfqbox-wrap clear">
                        <span className={[this.comPlayMode(),'bflx','fl'].join(' ')} onClick={() => {this.changePlayMode()}}></span>
                        <span className="fl text" onClick={this.changelyricFlag}>词</span>
                        <span className="fl list"></span>
                    </div>
                </div>
                <audio ref="audio">您的浏览器不支持 audio 标签。</audio>
                {/* <playlist ref="playlist"></playlist> */}
                <Lyric ref={this.audioLyric}/>
            </div>
        )
    }
}
export default audio