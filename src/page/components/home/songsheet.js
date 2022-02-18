import React,{useState,useEffect} from "react";
import {personalized} from "../../../api/api"
import {postJson} from '../../../api/apiConfig'
import { Link } from 'react-router-dom';
let SongSheetComp = (props,ref) => {
    const [songsheetdata,setsongsheetdata] = useState([])
    useEffect(() => {
        getsheet()
    })
    let getsheet = () =>{
        postJson(personalized,{},(res) => {
            setsongsheetdata(res.data.result)
        },(err)=>{
  
        })
    }
    return(
        <div className="wrap wrap-index-qt pd20 mt30">
            <h2 className="title">推荐歌单</h2>
            <div className="songsheet-wrap clear">
                {songsheetdata.map((item,index) => {
                    if(index > 27){
                        return ''
                    }
                    return <Link className="songsheet-list fl" key={index} to={'/sheetdetail?id=' + item.id}>
                        <div className="list-img">
                            <div className="list-playCount">{(item.playCount/10000).toString().split(".")[0] + "万"}</div>
                            <img src={item.picUrl + '?param=200y200'} alt={item.name}/>
                            <div className="list-player amn4"></div>
                        </div>
                        <div className="list-title">
                            <span>{item.name}</span>
                        </div>
                    </Link>
                })}
            </div>
        </div>
    )
}
export default SongSheetComp