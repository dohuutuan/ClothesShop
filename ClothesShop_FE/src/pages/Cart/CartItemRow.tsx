import { Box,  MenuItem, Select, Stack, Typography } from '@mui/material';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { useState } from 'react';
import type { UserCartResponse } from '../../types/types';
import { findColorAndSizeByVariantId, formatMoney } from './../../utils/functions';
import { useMutation } from '@tanstack/react-query';
import {  deleteCartItemApi } from '../../services/cartService';
import { queryClient } from '../../main';
const inputStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    color: "black",
    width: 30,
    fontSize: "13px",
    outline: "none",
    fontFamily: "inherit",
    textAlign: "center",
    fontWeight: 600,
};
const buttonStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    color: "black",
    fontSize: "15px",
    cursor: "pointer",
    padding: " 0 5px",
    fontWeight: 600,
};
export default function CartItemRow({ item, selectedProducts, setSelectedProducts }:
    {
        item: UserCartResponse,
        selectedProducts: number[],
        setSelectedProducts: React.Dispatch<React.SetStateAction<number[]>>
    }) {
    const deleteCartItem = useMutation({
        mutationFn: (cartItemId: number) => deleteCartItemApi(cartItemId),
        onSuccess: () => {
            const guestToken = localStorage.getItem("guestToken");
            queryClient.invalidateQueries({
                queryKey: ["cartQuantity", guestToken],
            });
            queryClient.invalidateQueries({
                queryKey: ["userCart", guestToken],
            });
        },
        onError: (error) => {
            console.error("Error deleting cart item:", error);
        }
    });
    
    const [quantity, setQuantity] = useState(item.quantity);
    const variantInfo = findColorAndSizeByVariantId(item.colors, item.variantId);
    const [selectedColor, setSelectedColor] = useState(variantInfo?.colorId || item.colors[0].id);
    const [selectedSize, setSelectedSize] = useState(variantInfo?.sizeId || item.colors[0].sizes[0].id);

    const currentColor = item.colors.find(c => c.id === selectedColor);
    const availableSizes = currentColor?.sizes || [];

    return (
        <Stack direction={"row"}
            sx={{
                gap: 1,
                alignItems: "center",
                px: 1,
                py: 2,
            }}>
            <Box>
                <Stack direction={"row"}
                    onClick={() => {
                        if (selectedProducts.includes(item.cartItemId)) {
                            setSelectedProducts(selectedProducts.filter(id => id !== item.cartItemId));
                        } else {
                            setSelectedProducts([...selectedProducts, item.cartItemId]);
                        }
                    }}
                    sx={{
                        width: { xs: "30px", lg: "20px" },
                        aspectRatio: "1/1",
                        border: "2px solid",
                        borderColor: selectedProducts?.includes(item.cartItemId) ? "#3f3ddd" : "#a9a9acff",
                        borderRadius: "5px",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                    }}>
                    <Box
                        sx={{
                            width: "75%",
                            aspectRatio: "1/1",
                            backgroundColor: selectedProducts?.includes(item.cartItemId) ? "#3f3ddd" : "transparent",
                            borderRadius: "2px",
                        }}
                    />
                </Stack>
            </Box>
            {/* image */}
            <Box
                sx={{
                    width: "20%",
                    height: { xs: "100px", lg: "150px" },
                    overflow: "hidden",
                    borderRadius: "10px",
                }}>
                <img style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }}
                    src={item.image} alt="" />
            </Box>
            <Stack direction={"column"}
                sx={{
                    width: "80%",
                    height: { xs: "100px", lg: "150px" },
                    justifyContent: "space-between",
                    pl: 1
                }}>
                <Stack direction={"column"}
                    sx={{
                        gap: 0.5
                    }}>
                    <Typography sx={{
                        fontSize: { xs: "0.8rem", lg: "16px" },
                        fontWeight: 600,
                        color: "#000000ff",
                        letterSpacing: "-0.5px",
                    }}>
                        {item.productName}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: { xs: "0.8rem", lg: "14px" },
                            fontWeight: 500,
                            color: "#565657ff",
                            letterSpacing: "-1px",
                        }}>
                        Xanh / L
                    </Typography>
                    
                        <Stack direction={"row"}
                            sx={{
                                gap: 1,
                                alignItems: "center",
                                justifyContent: "space-between",
                                flexWrap: "wrap",
                            }}>
                            <Stack direction={"row"} sx={{gap:1,
                                height: "35px",
                            }}>
                                <Select
                                    fullWidth
                                    value={selectedColor}
                                    onChange={(e) => {
                                        const newColorId = e.target.value;
                                        setSelectedColor(newColorId);
                                        const newSizes = item.colors.find(c => c.id === newColorId)?.sizes || [];
                                        setSelectedSize(newSizes[0]?.id || 0);
                                    }}
                                    displayEmpty
                                    sx={{
                                        fontSize: "14px",
                                        borderRadius: "50px",
                                    }}>
                                    {item.colors.map(color => (
                                        <MenuItem key={color.id} value={color.id}>
                                            {color.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <Select
                                    value={selectedSize}
                                    onChange={(e) => setSelectedSize(e.target.value)}
                                    displayEmpty
                                    sx={{
                                        fontSize: "14px",
                                        borderRadius: "50px",
                                    }}>
                                    {availableSizes.map(size => (
                                        <MenuItem key={size.id} value={size.id}>
                                            {size.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Stack>
                            <Stack direction={"row"}
                                sx={{
                                    gap: 2,
                                    alignItems: "center"
                                }}>
                                <Stack direction={"row"}
                                    sx={{
                                        border: "1px solid #a9a9acff",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        backgroundColor: "#ffffffff",
                                        color: "white",
                                        borderRadius: "999px",
                                        px: 1,
                                        py: 0.5,
                                        height: { lg: "30px", xs: "30px" },
                                    }}
                                >
                                    <button
                                        style={buttonStyle}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setQuantity(prev => Math.max(1, prev - 1));
                                        }}
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
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setQuantity(prev => Math.min(999, prev + 1));
                                        }}
                                    >
                                        +
                                    </button>
                                </Stack>
                                <Typography sx={{
                                    fontSize: { xs: "0.8rem", lg: "16px" },
                                    fontWeight: 700,
                                    color: "#000000ff",
                                    letterSpacing: "-0.5px",
                                }}>
                                    {formatMoney(item.totalPrice)}
                                </Typography>
                            </Stack>
                        </Stack>
                 
                </Stack>
                <Stack direction={"row"}
                    onClick={() => {
                        deleteCartItem.mutate(item.cartItemId);
                    }}
                    sx={{
                        alignItems: "center",
                        color: "#565657ff",
                        "&:hover": {
                            color: "#e53935",
                        },
                        cursor: "pointer",
                    }}>
                    <DeleteForeverOutlinedIcon sx={{
                        color: "inherit",
                        fontSize: { xs: "0.8rem", lg: "18px" },
                    }} />
                    <Typography sx={{
                        fontSize: { xs: "0.8rem", lg: "14px" },
                        color: "inherit",
                        fontWeight: 500,
                        letterSpacing: "-1px",
                    }}>
                        Xoá
                    </Typography>
                </Stack>
            </Stack>
        </Stack>
    );
}
