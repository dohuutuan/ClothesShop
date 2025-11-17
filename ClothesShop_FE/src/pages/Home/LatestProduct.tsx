import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import BestSellerCard from "./BestSellerCard";
import { A11y, Scrollbar } from "swiper/modules";
import type { ProductCardDTO } from "../../types/types";
export default function LatestProduct({data}:{ data: ProductCardDTO[] }) {
    const theme = useTheme();
    const isMobile: boolean = useMediaQuery(theme.breakpoints.down("sm"));
    return (
        <Box sx={{
            px: 3,
            py: 3
        }}>
            <Typography variant="h2"
                sx={{
                    fontWeight: 600,
                    fontSize: { lg: "30px", xs: "20px" },
                }}>
                SẢN PHẨM MỚI NHẤT CỦA CHÚNG TÔI
            </Typography>
            <Swiper
                modules={[Scrollbar, A11y]}
                spaceBetween={20}
                slidesPerView={isMobile ? 2 : 5}
                allowTouchMove={true}                
                style={{
                    marginTop: "15px",
                }}
            >
                {data?.map((product) => (
                    <SwiperSlide >
                        <BestSellerCard product={product} />
                    </SwiperSlide>
                ))}

            </Swiper>

        </Box>
    )
}
