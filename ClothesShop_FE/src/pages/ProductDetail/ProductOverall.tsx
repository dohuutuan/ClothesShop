import { Box, Button, Divider, IconButton, Rating, Stack, Typography } from "@mui/material";
import type { ColorDTO, ProductCardDTO, SizeDTO } from "../../types/types";
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import { useState } from "react";
import { formatMoney, generateGuestToken } from './../../utils/functions';
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { addToCartApi } from "../../services/cartService";
import { Bounce, toast } from "react-toastify";
import { queryClient } from "../../main";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Thumbs, Navigation } from 'swiper/modules';
import { Swiper as SwiperClass } from 'swiper';
import "./productImage.scss"
import StarRoundedIcon from '@mui/icons-material/StarRounded';
const inputStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    color: "white",
    width: 50,
    fontSize: "15px",
    outline: "none",
    fontFamily: "inherit",
    textAlign: "center"
};
const buttonStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "18px",
    cursor: "pointer",
    padding: " 0 10px",
};
export default function ProductOverall({ product }: { product: ProductCardDTO }) {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
    const [selectedColor, setSelectedColor] = useState<ColorDTO | null>(product.colors[0] || null);
    const [selectedSize, setSelectedSize] = useState<SizeDTO | null>(product.colors[0]?.sizes[0] || null);
    const [quantity, setQuantity] = useState<number>(1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isLogin = useSelector((state: any) => state.auth.login);
    const handleAddToCart = (variantId: number, quantity: number) => {
        if (!isLogin) {
            let guestToken = localStorage.getItem("guestToken");
            if (!guestToken) {
                guestToken = generateGuestToken();
                localStorage.setItem("guestToken", guestToken);
            }
            addCartMutation.mutate({
                guestToken,
                variantId,
                quantity
            });
        } else {
            addCartMutation.mutate({
                guestToken: null,
                variantId,
                quantity
            });
        }
    };

    const addCartMutation = useMutation({
        mutationFn: addToCartApi,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["cartQuantity", isLogin ? null : localStorage.getItem("guestToken")],
            });
            toast.dismiss();
            toast.success('Thêm sản phẩm vào giỏ hàng thành công!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });

        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            toast.error(error?.response?.data?.message
                ? error.response.data.message
                : "Thêm sản phẩm vào giỏ hàng thất bại", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
        },
    });
    const handleChangeColor = (color: ColorDTO) => {
        setSelectedColor(color);
        // setImage(color.images[0]);
        setSelectedSize(color.sizes[0] || null);
    }
    return (
        <>
            <Stack direction={"row"}
                className="productOverall"
                sx={{
                    p: 4,
                    flexWrap: "wrap"
                }}>
                {/* left section */}
                <Stack direction={"row"}
                    sx={{
                        width: { lg: "50%", xs: "100%" },
                        gap: 2
                    }}>
                    {/* small thumbnails */}
                    <Box sx={{
                        width: "8%",
                        height: "537px",
                        overflowY: "auto"
                    }}>
                        <Swiper
                            direction="vertical"
                            slidesPerView={10}
                            spaceBetween={1}
                            onSwiper={setThumbsSwiper}
                            watchSlidesProgress
                            modules={[Thumbs]}
                            style={{ height: "100%" }}
                        >
                            {selectedColor?.images.map((imgUrl, index) => (
                                <SwiperSlide key={index}>
                                    <Box
                                        className="thumb-slide"
                                        sx={{
                                            aspectRatio: "1 / 1",
                                            width: "100%",
                                            overflow: "hidden",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <img
                                            src={imgUrl}
                                            alt=""
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    </Box>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </Box>

                    {/* large image Swiper */}
                    <Box sx={{
                        width: "92%",
                        height: "537px",
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: "8px"
                    }}>
                        <Swiper
                            spaceBetween={10}
                            slidesPerView={1}
                            loop
                            thumbs={{ swiper: thumbsSwiper }}
                            navigation={{
                                nextEl: ".swiper-button-nextImage",
                                prevEl: ".swiper-button-prevImage"
                            }}
                            modules={[Thumbs, Navigation]}
                            style={{ height: "100%" }}
                        >
                            {selectedColor?.images.map((imgUrl, index) => (
                                <SwiperSlide key={index}>
                                    <img
                                        src={imgUrl}
                                        alt=""
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                        }}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <Stack
                            direction="row"
                            sx={{
                                position: "absolute",
                                top: "90%",
                                left: "85%",
                                gap: 0.5,
                            }}
                        >
                            {/* left navigation */}
                            <IconButton
                                className="swiper-button-prevImage"
                                sx={{
                                    zIndex: 10,
                                    backgroundColor: "white",
                                    color: "black",
                                    "&:hover": {
                                        backgroundColor: "black",
                                        color: "white",
                                    },
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    boxShadow: 1,
                                }}
                            >
                                <ArrowBackIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                            {/* right navigation */}
                            <IconButton
                                className="swiper-button-nextImage"
                                sx={{
                                    zIndex: 10,
                                    backgroundColor: "white",
                                    color: "black",
                                    "&:hover": {
                                        backgroundColor: "black",
                                        color: "white",
                                    },
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    boxShadow: 1,
                                }}
                            >
                                <ArrowForwardIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                        </Stack>
                    </Box>

                </Stack>

                {/* right section */}
                <Box sx={{
                    pl: 5,
                    width: { lg: "50%", xs: "100%" },
                }}>
                    <Typography variant="h1"
                        sx={{
                            fontSize: { xs: "1.5rem", lg: "28px" },
                            fontWeight: 700
                        }}>
                        {product.name}
                    </Typography>
                    <Stack direction={"row"}
                        sx={{
                            gap: 0.5,
                            alignItems: "end",
                            mt: 1
                        }}>
                        <Rating
                            value={product.rating.average}
                            precision={0.1}
                            readOnly
                            size="medium"
                            icon={
                                <StarRoundedIcon
                                    sx={{
                                        fontSize: "30px",
                                        color: 'black',
                                    }}
                                />
                            }
                            emptyIcon={
                                <StarRoundedIcon
                                    sx={{
                                        fontSize: "30px",
                                    }}
                                />
                            }
                            />
                        <Typography
                            sx={{
                                fontSize: { xs: "0.875rem", lg: "17px" },
                                fontWeight: 600,
                            }}>
                            {product.rating.average} ({product.rating.count} đánh giá)
                        </Typography>
                    </Stack>
                    <Divider sx={{
                        borderColor: '#cdcdcdff',
                        mt: 1
                    }} />
                    <Typography variant="h2"
                        sx={{
                            fontSize: { xs: "1.5rem", lg: "28px" },
                            fontWeight: 700,
                            mt: 1
                        }}>
                        {formatMoney(product.price)}
                    </Typography>
                    {/* color */}
                    <Stack direction={"column"}
                        sx={{
                            mt: 2,
                            gap: 0.5
                        }}>
                        <Typography>Màu sắc: {selectedColor?.name}</Typography>
                        <Stack direction={"row"} sx={{ gap: 1, flexWrap: "wrap" }}>
                            {product.colors.length > 0 && product.colors.map((color, index) => (
                                <Box key={index} sx={{
                                    overflow: "hidden",
                                    borderRadius: "999px",
                                    height: { lg: "36px", xs: "18px" },
                                    width: { lg: "58px", xs: "33px" },
                                    p: "2px",
                                    border: selectedColor == color ? "2px solid blue" : "2px solid gray",
                                    cursor: "pointer",
                                }}
                                    onClick={() => handleChangeColor(color)}>
                                    <img src={color.thumbnailUrl}
                                        style={{
                                            objectFit: "cover",
                                            width: "100%",
                                            height: "100%",
                                            borderRadius: "999px",
                                        }} />
                                </Box>
                            ))}
                        </Stack>
                    </Stack>
                    {/* size */}
                    <Stack direction={"column"}
                        sx={{

                            mt: 2,
                            gap: 0.5
                        }}>
                        <Stack direction={"row"}
                            sx={{
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}>
                            <Typography>Kích thước: {selectedSize?.name} | {selectedSize?.description}</Typography>
                            <Typography sx={{
                                fontSize: { xs: "0.75rem", lg: "14px" },
                                letterSpacing: "-1px",
                                textDecoration: "underline",
                                color: "#0000adff",
                                cursor: "pointer",
                            }}>
                                Hướng dẫn chọn size
                            </Typography>
                        </Stack>
                        <Stack direction={"row"}
                            sx={{
                                gap: 0.5,
                                flexWrap: "wrap",
                                maxWidth: "90%",
                            }}>
                            {selectedColor && selectedColor.sizes.map((size, index) => (
                                <Box key={index}
                                    onClick={() => setSelectedSize(size)}
                                    sx={{
                                        width: { lg: "70px" },
                                        height: { lg: "44px" },
                                        backgroundColor: selectedSize === size ? "black" : "#d1d1d1ff",
                                        color: selectedSize === size ? "#ffffff" : "#000000",
                                        marginTop: "5px",
                                        borderRadius: "10px",
                                        cursor: "pointer",
                                        "&:hover": {
                                            backgroundColor: "black",
                                            color: "#ffffff",
                                        },
                                        transition: "all 0.3s ease",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}>
                                    <Typography variant="h6" sx={{
                                        fontWeight: 600,
                                        fontSize: { lg: "14px" },
                                        textAlign: "center",
                                    }}>
                                        {size.name}
                                    </Typography>
                                </Box>))}
                        </Stack>
                    </Stack>
                    {/* button */}
                    <Stack direction={"row"}
                        sx={{ mt: 5, gap: 2 }}>
                        <Stack direction={"row"}
                            sx={{
                                alignItems: "center",
                                justifyContent: "space-between",
                                backgroundColor: "#434343",
                                color: "white",
                                borderRadius: "999px",
                                px: 1,
                                py: 0.5,
                                height: { lg: "50px", xs: "30px" },
                            }}
                        >
                            <button
                                style={buttonStyle}
                                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                            >
                                –
                            </button>
                            <input
                                type="text"
                                style={inputStyle}
                                value={quantity}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (/^\d+$/.test(val)) {
                                        const num = parseInt(val, 10);
                                        if (num < 1) {
                                            setQuantity(1);
                                        } else if (num > 999) {
                                            setQuantity(999);
                                        } else {
                                            setQuantity(num);
                                        }
                                    } else {
                                        setQuantity(1);
                                    }
                                }}

                            />
                            <button
                                style={buttonStyle}
                                onClick={() => setQuantity(prev => Math.min(999, prev + 1))}
                            >
                                +
                            </button>
                        </Stack>
                        <Button variant="contained"
                            onClick={() => handleAddToCart(selectedSize?.variantId || 0, quantity)}
                            fullWidth
                            startIcon={<LocalMallOutlinedIcon />}
                            sx={{
                                borderRadius: "999px",
                                fontSize: { lg: "16px", xs: "12px" },
                            }}>
                            Thêm vào giỏ hàng
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </>
    )
}
