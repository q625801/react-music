import React from "react";
import {personalized} from "../../../api/api"
import {postJson} from '../../../api/apiConfig'
class SongSheet extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            songsheetdata:[]
        }
    }
    componentDidMount(){
        this.getsheet()
    }
    getsheet(){
        postJson(personalized,{},(res) => {
          this.setState({
            songsheetdata:res.data.result
          })
        //   console.log(this.state)
        },(err)=>{
  
        })
    }
    render(){
        return(
            <div className="wrap wrap-index-qt pd20 mt30">
                <h2 className="title">推荐歌单</h2>
                <div className="songsheet-wrap clear">
                    {this.state.songsheetdata.map((item,index) => {
                        if(index > 27){
                            return ''
                        }
                        return <div className="songsheet-list fl" key={index}>
                            <div className="list-img">
                                <div className="list-playCount">{(item.playCount/10000).toString().split(".")[0] + "万"}</div>
                                <img src={item.picUrl + '?param=200y200'} alt={item.name}/>
                                <div className="list-player amn4"></div>
                            </div>
                            <div className="list-title">
                                <span>{item.name}</span>
                            </div>
                        </div>
                    })}
                </div>
            </div>
        )
    }
}
export default SongSheet