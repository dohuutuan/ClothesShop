import { Swiper, SwiperSlide } from 'swiper/react';
import { Box, Chip, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import "./slider.scss"
import { A11y,  Scrollbar } from 'swiper/modules';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
interface ParentCategoryProps {
    male: GenderData[];
    female: GenderData[];
}
interface GenderData {
    slug: string;
    name: string;
    image: string;
}
interface Data {
    data: ParentCategoryProps;
}
export default function ParentCategory({ data }: Data) {
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile: boolean = useMediaQuery(theme.breakpoints.down("sm"));
    const [selectedCategory, setSelectedCategory] = useState(data.male);
    return (
        <Box sx={{}}>
            <Stack direction={"row"} sx={{ py: 3, gap: 2 }}>
                <Chip label="ĐỒ NAM"
                    onClick={() => setSelectedCategory(data.male)}
                    sx={{
                        py: { lg: 3, xs: 0.5 },
                        px: { lg: 2.2, xs: 0.5 },
                        backgroundColor: selectedCategory === data.male ? "black" : "#e0e0e0",
                        color: selectedCategory === data.male ? "white" : "black",
                        borderRadius: 40,
                        fontWeight: 700, fontSize: { lg: "16px", xs: "12px" },
                        "&:hover": {
                            backgroundColor: selectedCategory == data.male ? "black" : "#e0e0e0", // giữ nguyên
                        },
                    }} />
                <Chip label="ĐỒ NỮ Test"
                    onClick={() => setSelectedCategory(data.female)}
                    sx={{
                        py: { lg: 3, xs: 0.5 },
                        px: { lg: 2.2, xs: 0.5 },
                        backgroundColor: selectedCategory == data.female ? "black" : "#e0e0e0",
                        color: selectedCategory == data.female ? "white" : "black",
                        borderRadius: 40,
                        fontWeight: 700, fontSize: { lg: "16px", xs: "12px" },
                        "&:hover": {
                            backgroundColor: selectedCategory == data.female ? "black" : "#e0e0e0", // giữ nguyên
                        },
                    }} />
            </Stack>
            {/* children category */}
            <Box sx={{ mt: { xs: -2, lg: -1 } }}>
                <Swiper
                    modules={[Scrollbar, A11y]}
                    spaceBetween={20}
                    slidesPerView={isMobile ? 2.5 : 5}
                    allowTouchMove={false}
                >
                    {selectedCategory.map((item, index) => (
                        <SwiperSlide key={index}>
                            <Stack direction={"column"}
                            onClick={() => navigate(`/category/${item.slug}`)}
                                sx={{
                                    alignItems: "center",
                                    gap: 1,
                                    cursor: "pointer",
                                    "&:hover .MuiTypography-root": {
                                        color: "#4054D9",
                                        transition: "color 0.4s ease",
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        borderRadius: "8px",
                                        overflow: "hidden",
                                        height: { lg: "320px", xs: "180px" },
                                    }}>
                                    <img src={item.image}
                                        className="parent-category-image"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            objectPosition: "bottom",
                                        }} />
                                </Box>
                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: {
                                            lg: "17px"
                                        },
                                        textTransform: "uppercase",
                                    }}>
                                    {item.name}
                                </Typography>
                            </Stack>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Box>
        </Box>
    )
}
