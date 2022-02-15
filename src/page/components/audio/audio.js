import React from 'react'
import { Slider } from 'antd'
import 'antd/dist/antd.css'
import '../../../assets/css/audio.css'
import {mp3url} from '../../../api/api'
import {postJson} from '../../../api/apiConfig'
import store from "../../../redux/store"
import {setAudioPlayBtn} from "../../../redux/actions"
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
        }
        this.audioplay = this.audioplay.bind(this)
    }
    componentDidMount(){
        this.audioTimeUpdate()
        this.getmusicurl(369126)
        let that = this
        store.subscribe(() => {
            let storeData = store.getState()
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
        //   that.setLyric()
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
          if(that.state.audioPlayMode == 'loopone'){
            audio.play()
          }else{
            store.dispatch(setAudioPlayBtn(false))
            // that.nextSong()
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
    render(){
        return(
            <div className="wrap audio-wrap sdwa">
                <div className="player-bar">
                    <div className="avatar">
                        <img alt="nicemusic" src={this.state.SongPic + '?param=100y100'} title={this.state.SongName}/>
                    </div>
                    <div className="info">
                        <h2 className="ellipsis">{this.state.SongName}</h2>
                        <p className="ellipsis">{this.state.SongArtists}</p>
                    </div>
                    <div className="player-btn clear">
                        <span className="player-prev fl"></span>
                        <span onClick={this.audioplay} className={['fl',this.state.audiostate ? 'player-play' : 'player-stop'].join(' ')}></span>
                        <span className="player-next fl"></span>
                    </div>
                    <div id="progress-wrap" className="progress-wrap">
                        <p className="current-time">{this.state.playTime}</p>
                        <div className="progress-bar-wrap">
                            <div className="progress-bar" ref="barBg">
                                <div className="bar-inner">
                                    <div className="progress" style={{width:this.state.progressWidth + '%'}}></div>
                                    <div className="progress-btn" ref="barBgyuan" style={{left:this.state.progressWidth + '%'}}></div>
                                </div>
                            </div>
                        </div>
                        <p className="duration-time"> {this.state.audioduration ? ((parseInt(this.state.audioduration / 60, 10) <= 9 ? '0' + parseInt(this.state.audioduration / 60, 10) : parseInt(this.state.audioduration / 60, 10)) + ':' + (parseInt(this.state.audioduration % 60) <= 9 ? '0' + parseInt(this.state.audioduration % 60) : parseInt(this.state.audioduration % 60))) : ''}</p>
                    </div>
                    <div className="volume-wrap">
                        <div title={this.state.volumeTitle} className={['volume-yl',this.state.VolumeSize == 0 ? 'off' : ''].join(' ')}></div>
                        <div className='volume-slider'>
                            <Slider defaultValue={30}/>
                        </div>
                    </div>
                    <div className="bfqbox-wrap clear">
                        <span className={['comPlayMode','bflx','fl'].join(' ')}></span>
                        <span className="fl text">词</span>
                        <span className="fl list"></span>
                    </div>
                </div>
                <audio ref="audio">您的浏览器不支持 audio 标签。</audio>
                {/* <playlist ref="playlist"></playlist>
                <lyric ref="lyric"></lyric> */}
            </div>
        )
    }
}
export default audio