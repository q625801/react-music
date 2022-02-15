import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import {Autoplay } from 'swiper';
import {postJson} from '../../../api/apiConfig'
import {banner} from '../../../api/api'
class Banner extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            bannerImg:[]
        }
    }
    componentDidMount(){
        this.getBanner()
    }
    getBanner(){
        postJson(banner,{type:0},(res) => {
            this.setState({
                bannerImg: res.data.banners
            })
        },(err)=>{
    
        })
    }
    render(){
        return(
            <Swiper
                modules={[Autoplay]}
                spaceBetween={50}
                slidesPerView={1}
                loop
                autoplay={{delay:2000,disableOnInteraction:false}}
                onSwiper={(swiper) => {}}
                onSlideChange={() => {}}
            >
                {this.state.bannerImg.map((item,index) => {
                    return <SwiperSlide key={index}><img src={item.imageUrl} width="100%" alt='banner'/></SwiperSlide>
                })}
            </Swiper>
        )
    }
}
export default Banner