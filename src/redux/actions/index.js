const sendAction = () => {
    return {
        type:'send_audioFlag',
        value:true
    }
}
const setAudioPlayBtn = (data) => {
    return {
        type:'setAudioPlayBtn',
        value:data
    }
}
module.exports = {
    sendAction,setAudioPlayBtn
}