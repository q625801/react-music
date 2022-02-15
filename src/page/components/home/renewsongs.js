import React from "react"
import {newsong} from "../../../api/api"
import {postJson} from '../../../api/apiConfig'
import {SongArtistsComputed,playtime} from '../../../utils/common'
/*引入redux*/
import store from "../../../redux/store"
import {sendAction} from "../../../redux/actions"
class renewsong extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            newsongdata:[]
        }
    }
    componentDidMount(){
        this.getnewsong()
        store.subscribe(() => {
            console.log("subscribe：",store.getState())
        })
    }
    handleClick = () => {
        console.log("subscribe：",store.getState())
    }
    getnewsong(){
        postJson(newsong,{},(res) => {
            this.setState({
                newsongdata: res.data.result
            })
        },(err)=>{
  
        })
    }
    render(){
        return(
            <div className="wrap wrap-index-qt pd20">
                <h2 className="newsongs-title" onClick={this.handleClick}>推荐新歌曲</h2>
                <div className="newsongs-all clear">
                    {this.state.newsongdata.map((item,index) => {
                        return <div className={['newsongs-list','amn3','sdw','clear',index%2 === 0 ? 'fl' : 'fr'].join(' ')} key={index}>
                            <div className="fl newsongs-index">
                                <span>{index+1 >= 10 ? index+1:"0" + (index+1)}</span>
                                <div className="newsong-player"></div>
                            </div>
                            <div className="fl newsongs-img">
                                <img src={item.picUrl + '?param=100y100'} alt={item.picUrl}/>
                            </div>
                            <div className="fl newsongs-info">
                                <span>{item.name}</span>
                                <span>{SongArtistsComputed(item.song.artists)}</span>
                            </div>
                            <div className="fr newsongs-duration">
                                <span className="time">{playtime(item.song.bMusic.playTime)}</span>
                            <div className="effect">
                                <span className="line1"></span>
                                <span className="line2"></span>
                                <span className="line3"></span>
                                <span className="line4"></span>
                            </div>
                            </div>
                        </div>
                    })}
                </div>
            </div>
        )
    }
}
export default renewsong