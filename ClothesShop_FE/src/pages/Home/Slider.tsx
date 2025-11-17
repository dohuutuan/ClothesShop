import { Swiper, SwiperSlide } from 'swiper/react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import "./slider.scss"
import { A11y, Autoplay, Navigation, Scrollbar } from 'swiper/modules';
const img = [
  "https://media3.coolmate.me/cdn-cgi/image/width=1920,quality=90,format=auto/uploads/May2025/1920x788_29.jpg",
  "https://media3.coolmate.me/cdn-cgi/image/width=1920,quality=90,format=auto/uploads/May2025/1920x788_29.jpg",
  "https://img.pikbest.com/templates/20240710/banner-sale-for-fashion-shop-selling-children-27s-clothes-_10660315.jpg!w700wp",
  "https://thietkewebchuyen.com/wp-content/uploads/thiet-ke-banner-website-anh-bia-Facebook-shop-quan-ao-nam-nu-2.jpg",
  "https://arena.fpt.edu.vn/wp-content/uploads/2022/10/banner-thoi-trang.jpg"
]
export default function Slider() {
  const theme = useTheme();
  const isMobile: boolean = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box
      className="slider"
      sx={{
        width: '100%',
        overflow: 'hidden',
        height: { lg: '500px', xs: '170px' },
      }}>
      <Swiper
        modules={[Navigation, Scrollbar, A11y, Autoplay]}
        autoplay={{ delay: 3000 }}
        loop
        spaceBetween={0}
        slidesPerView={1}
        navigation={!isMobile}
      >
        {img.map((item, index) => (
          <SwiperSlide key={index}>
            <Box sx={{ position: 'relative', }}>
              <img
                src={item}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />

            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  )
}
