import {useState, useImperativeHandle,forwardRef} from 'react';
let LyricComp = (props,ref) => {
    const [lyricFlag,setlyricFlag] = useState(false);
    const [lyricData,setlyricData] = useState([])
    const [lyricVersion,setlyricVersion] = useState(true)
    const [lineNo,setlineNo] = useState(0)
	// 此处注意useImperativeHandle方法的的第一个参数是目标元素的ref引用
    const parseLyric = (text) => {
        //按行分割歌词
        let lyricArr = text.split('\n');
        let result = []; //新建一个数组存放最后结果
        //遍历分割后的歌词数组，将格式化后的时间节点，歌词填充到result数组
        for (let i = 0; i < lyricArr.length; i++) {
            let playTimeArr = lyricArr[i].match(/\[\d{2}:\d{2}((\.|\:)\d{1,5})\]/g); //正则匹配播放时间
            let lineLyric = "";
            if (lyricArr[i].split(playTimeArr).length > 0) {
                lineLyric = lyricArr[i].split(playTimeArr);
            }
            if (playTimeArr != null) {
                for (let j = 0; j < playTimeArr.length; j++) {
                    let time = playTimeArr[j].substring(1, playTimeArr[j].indexOf("]")).split(":");
                    //数组填充
                    result.push({
                        time: (parseInt(time[0]) * 60 + parseFloat(time[1])).toFixed(4),
                        content: String(lineLyric).substr(1)
                    });
                }
            }
        }
        if(result.length > 0){
            setlyricVersion(true)
            return result
        }else{
            setlyricVersion(false)
            return lyricArr
        }
    }
	useImperativeHandle(ref, () => ({
		// changeVal 就是暴露给父组件的方法
	    changelyricFlag: () => {
            if(lyricFlag){
                setlyricFlag(false)
            }else{
                setlyricFlag(true)
            }
	    },
        changelyricData: (newVal) => {
            setlineNo(0)
            setlyricData(parseLyric(newVal.lyric))
        },
        highLight: () => {
            if(!lyricVersion){
                return
            }
            let allHegiht = 0
            let lyricul = document.getElementById('lyricul')
            for(let i = 0;i<this.lineNo;i++){
                allHegiht += lyricul.children[i].offsetHeight
            }
            lyricul.style.top = (-allHegiht + 180) + 'px';
        },
        getLineNo: (currentTime) => {
            if(lineNo == -1 || lineNo == undefined){
                setlineNo(0)
            }
            // console.log(this.lyricData,this.lineNo)
            if(lyricData && lyricData.length > 0 && lyricData[lineNo].time){
                if (currentTime >= parseFloat(lyricData[lineNo].time)) {
                    // 快进
                    for (let i = lyricData.length - 1; i >= lineNo; i--) {
                        if (currentTime >= parseFloat(lyricData[i].time)) {
                            return i;
                        }
                    }
                } else {
                    // 后退
                    for (let i = 0; i <= lineNo; i++) {
                        if (currentTime <= parseFloat(lyricData[i].time)) {
                            return i - 1;
                        }
                    }
                }
            }
        }
  	}));
  	return (
		<div className={['wrap-lyriclist','amn6','sdwa',lyricFlag ? 'show' : ''].join(' ')}>
            <div className="lyric-content">
                <ul className="amn4" id='lyricul' style={{display:lyricVersion?'block':'none'}}>
                    {lyricData.map((item,index) => {
                        return <li key={index} className={lineNo == index ? 'active' : ''}>{item.content}</li>
                    })}
                </ul>
                {/* // <p className="lyric-p" v-for="(item,index) in lyricContent" :key="index" v-else>{{item}}</p> */}
            </div>
        </div>
	)
}
LyricComp = forwardRef(LyricComp)
export default LyricComp