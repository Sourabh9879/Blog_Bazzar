import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';

import Img1 from '../../assets/hero-carousel/img1.jpg'
import Img2 from '../../assets/hero-carousel/img2.jpg'
import Img3 from '../../assets/hero-carousel/img3.jpg'
import Img4 from '../../assets/hero-carousel/img4.jpg'

import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Autoplay, Pagination } from 'swiper/modules';

function Hero() {
  return (
    <div className=' flex flex-col md:flex-row justify-between items-center md:gap-14 gap-8'>
        <div className='md:w-1/2 w-full text-center'>
            <h1 className='md:-text-5xl text-3xl font-bold md:leading-tight'>Welcome to Blog Bazzar</h1>
            <p className='py-4'>Blog Bazzar is a dynamic and engaging platform where users can explore a wide variety of blogs on diverse topics. From insightful articles and thought-provoking essays to practical guides and personal stories, Blog Bazzar offers a rich array of content tailored to various interests. The user-friendly interface allows readers to easily discover and interact with their favorite bloggers, while providing a space for writers to share their passions and connect with an engaged audience. Whether you're looking for the latest trends, in-depth analyses, or just a good read, Blog Bazzar has something for everyone.</p>
        </div>

        <div className='md:w-1/2 w-full mx-auto'>
        <Swiper
        slidesPerView={1}
        spaceBetween={10}
        pagination={{
          clickable: true,
        }}
        autoplay={{
            delay: 1500,
            disableOnInteraction: false,
          }}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 1,
            spaceBetween: 50,
          },
        }}
        modules={[Pagination, Autoplay]}
        className="mySwiper"
      >
        <SwiperSlide>
            <img src={Img1} alt="" className='w-full lg:h-[420px] sm:h-96 h-80'/>
        </SwiperSlide>
        <SwiperSlide>
            <img src={Img2} alt="" className='w-full lg:h-[420px] sm:h-96 h-80'/>
        </SwiperSlide>
        <SwiperSlide>
            <img src={Img3} alt="" className='w-full lg:h-[420px] sm:h-96 h-80'/>
        </SwiperSlide>
        <SwiperSlide>
            <img src={Img4} alt="" className='w-full lg:h-[420px] sm:h-96 h-80'/>
        </SwiperSlide>
       
      </Swiper>
        </div>
    </div>
  )
}

export default Hero