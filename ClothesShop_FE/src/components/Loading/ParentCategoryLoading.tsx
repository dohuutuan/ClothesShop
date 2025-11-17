import { Box, Skeleton, Stack } from "@mui/material";
import { A11y, Mousewheel, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function ParentCategoryLoading() {
    return (
        <Box sx={{}}>
            <Stack direction={"row"} sx={{ py: 3, gap: 2 }}>
                <Skeleton variant="circular" sx={{ borderRadius: 40, width: 120, height: 50 }} />
                <Skeleton variant="circular" sx={{ borderRadius: 40, width: 120, height: 50 }} />
            </Stack>
            {/* children category */}
            <Box sx={{ mt: { xs: -2, lg: -1 } }}>
                <Swiper
                    modules={[Scrollbar, A11y, Mousewheel]}
                    spaceBetween={20}
                    slidesPerView={5}
                    mousewheel
                    allowTouchMove={false}
                >
                    {[...Array(5)].map((index) => (
                        <SwiperSlide key={index}>
                            <Stack direction={"column"}
                                sx={{
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <Skeleton variant="rectangular" sx={{
                                    borderRadius: "8px",
                                    width: { xs: 100, lg: 230 },
                                    height: { xs: 100, lg: 300}
                                }} />
                                <Skeleton variant="text" sx={{ width: 100, height: 25 }} />
                            </Stack>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Box>
        </Box>
    )
}
