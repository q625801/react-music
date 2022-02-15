import React from "react";
import Banner from "./components/home/banner";
import SongSheet from "./components/home/songsheet";
import RenewSong from "./components/home/renewsongs"
import '../assets/css/home.css'
function Home(){
    return(
        <div className="container">
            <Banner/>
            <SongSheet/>
            <RenewSong/>
        </div>
    )
}
export default Home