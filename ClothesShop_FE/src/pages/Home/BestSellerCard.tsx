import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import StarIcon from '@mui/icons-material/Star';
import { formatMoney, generateGuestToken } from "../../utils/functions";
import type { ColorDTO, ProductCardDTO } from "../../types/types";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { addToCartApi } from "../../services/cartService";
import { Bounce, toast } from "react-toastify";
import { queryClient } from "../../main";

export default function BestSellerCard({ product }: { product: ProductCardDTO }) {
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
            const guestToken = isLogin == true ? null : localStorage.getItem("guestToken");
            queryClient.invalidateQueries({
                queryKey: ["cartQuantity", guestToken],
            });
            queryClient.invalidateQueries({
                queryKey: ["userCart", guestToken]
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
    const navigate = useNavigate();
    const handleChangeColor = (color: ColorDTO) => {
        setSelectedColor(color);
        setImage(color.images[0]);
    }
    const theme = useTheme();
    const isMobile: boolean = useMediaQuery(theme.breakpoints.down("sm"));
    const [image, setImage] = useState<string>(product.colors[0]?.images[0] || "");
    const [selectedColor, setSelectedColor] = useState<ColorDTO | null>(product.colors[0] || null);
    return (
        <Box>
            <Stack direction={"column"}
                sx={{ gap: 2 }}>
                <Box sx={{
                    overflow: "hidden",
                    borderRadius: "10px",
                    height: { lg: "296px", xs: "180px" },
                    cursor: "pointer",
                    position: "relative",
                    "&:hover .glass-overlay": {
                        opacity: 1,
                        transform: "translate3d(-50%, 0, 0)",
                        pointerEvents: "auto",
                    },
                }}
                    onClick={() => { navigate(`/product/${product.productId}`) }}
                    onMouseEnter={() => {
                        if (selectedColor && selectedColor?.images.length > 1) {
                            setImage(selectedColor.images[1]);
                        }
                    }}
                    onMouseLeave={() => {
                        if (selectedColor && selectedColor?.images.length > 0) {
                            setImage(selectedColor.images[0])
                        }
                    }}
                >
                    <img src={image || "https://bizweb.dktcdn.net/100/446/974/products/ao-thun-mlb-new-era-heavy-cotton-new-york-yankees-black-13086578-1.jpg?v=1691318321487"}
                        style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                            display: "block",
                        }} />
                    <Stack direction={"row"}
                        sx={{
                            alignItems: "center",
                            position: "absolute",
                            top: "10px",
                            left: "9px",

                        }}>
                        <Typography variant="h6" sx={{
                            fontWeight: 500,
                            fontSize: { lg: "14px", xs: "12px" },
                        }}>
                            {product.rating.average}
                        </Typography>
                        <StarIcon sx={{ color: "#000000", fontSize: "14px" }} />
                    </Stack>
                    {!isMobile && (
                        <Box
                            className="glass-overlay"
                            onClick={(e) => e.stopPropagation()}
                            sx={{
                                cursor: "default",
                                WebkitBackdropFilter: "blur(20px)",
                                backdropFilter: "blur(20px)",
                                background:
                                    "linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), hsla(0, 0%, 100%, 0.4)",
                                borderRadius: "8px",
                                bottom: "1.5rem",
                                left: "50%",
                                maxWidth: "calc(100% - 4rem)",
                                opacity: 0,
                                padding: ".75rem .7rem",
                                pointerEvents: "none",
                                position: "absolute",
                                transform: "translate3d(-50%, 20px, 0)",
                                transition: "all 0.3s ease",
                                visibility: "visible",
                                width: "100%",
                                zIndex: 2,
                            }}
                        >
                            <Typography variant="h6" sx={{
                                fontWeight: 700,
                                fontSize: { lg: "12px", xs: "12px" },
                                color: "#000000",
                                textAlign: "center",
                            }}>
                                Thêm nhanh vào giỏ hàng
                            </Typography>
                            <Typography variant="h6" sx={{
                                fontWeight: 700,
                                fontSize: { lg: "12px", xs: "12px" },
                                color: "#000000",
                                textAlign: "center",
                            }}>
                                +
                            </Typography>
                            <Stack direction={"row"}
                                sx={{
                                    gap: 0.5,
                                    flexWrap: "wrap",
                                    maxWidth: "90%",
                                }}>
                                {selectedColor && selectedColor.sizes.map((size, index) => (
                                    <Box
                                        onClick={() => handleAddToCart(size.variantId, 1)}
                                        key={index} sx={{
                                            width: { lg: "40px" },
                                            height: { lg: "35px" },
                                            backgroundColor: "#ffffff",
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
                        </Box>
                    )}
                </Box>
                <Stack direction={"column"} sx={{ gap: 1 }}>
                    <Stack direction={"row"} sx={{ gap: 0.1, flexWrap: "wrap" }}>
                        {product.colors.length > 0 && product.colors.map((color, index) => (
                            <Box key={index} sx={{
                                overflow: "hidden",
                                borderRadius: "999px",
                                height: { lg: "18px", xs: "18px" },
                                width: { lg: "33px", xs: "33px" },
                                p: "2px",
                                border: selectedColor == color ? "1px solid black" : "",
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
                    <Stack direction={"column"}
                        sx={{
                            gap: 1,
                            cursor: "pointer"
                        }}
                        onClick={() => { navigate(`/product/${product.productId}`) }}>
                        <Typography variant="h4"
                            sx={{
                                fontSize: { lg: "13px", xs: "12px" },
                                fontWeight: 500,
                                "&:hover": {
                                    color: "#0095f9ff",
                                }
                            }}>
                            {product.name}
                        </Typography>
                        <Typography variant="h4"
                            sx={{
                                fontSize: { lg: "13px", xs: "12px" },
                                fontWeight: 700
                            }}>
                            {formatMoney(product.price)}
                        </Typography>
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    )
}
