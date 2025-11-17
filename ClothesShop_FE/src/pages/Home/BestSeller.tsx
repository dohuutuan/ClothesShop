import { Box, Button, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import EastIcon from '@mui/icons-material/East';
import BestSellerCard from "./BestSellerCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Mousewheel, Scrollbar } from "swiper/modules";
import type { ProductCardDTO } from "../../types/types";

export default function BestSeller({data} : { data: ProductCardDTO[] }) {
      const theme = useTheme();
      const isMobile: boolean = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box>
      <Box sx={{
        overflow: "hidden",
        width: "100%",
        height: { lg: "400px", xs: "200px" },
        position: "relative",
      }}>
        <img src="https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/May2025/Casual_-_Desktop.jpg" alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }} />
        <Stack direction={"column"}
          sx={{
            position: "absolute",
            bottom: "12%",
            left: "2%",
            gap: 4,
            maxWidth: { lg: "40%", xs: "300px" }
          }}>
          <Stack direction={"column"}
            sx={{}}>
            <Typography
              color="text.secondary"
              sx={{
                fontWeight: 700,
                fontSize: { lg: "60px", xs: "15px" },

              }}>
              BEST SELLING COLLECTION
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                fontWeight: 700,
                fontSize: { lg: "16px", xs: "12px" },

              }}>
              Hàng loạt những sản phẩm chất lượng
            </Typography>
          </Stack>
          <Button variant="contained"
            sx={{
              width: { lg: "230px", xs: "100px" },
              height: { lg: "60px", xs: "25px" },
              borderRadius: "9999px",
              backgroundColor: "white",
              color: "black",
              fontSize: { lg: "18px", xs: "7px" },
              fontWeight: 500,
              "&:hover": {
                backgroundColor: "black",
                color: "white"
              }
            }}
            endIcon={<EastIcon />}>
            MUA NGAY
          </Button>
        </Stack>
      </Box>
      {/* list products */}
      <Box sx={{
        px: 3,
        mt: 6
      }}>
        <Typography variant="h2"
          sx={{
            fontWeight: 600,
            fontSize: { lg: "30px", xs: "20px" },
          }}>
          SẢN PHẨM ĐƯỢC MUA NHIỀU NHẤT
        </Typography>
        <Swiper
          modules={[Scrollbar, A11y, Mousewheel]}
          spaceBetween={20}
          slidesPerView={isMobile ? 2 : 5}
          allowTouchMove={false}
          style={{
            marginTop:"15px",
          }}
        >
          {data?.map((product) => (
            <SwiperSlide >
              <BestSellerCard product={product} />
            </SwiperSlide>
          ))}

        </Swiper>

      </Box>
    </Box>
  )
}
