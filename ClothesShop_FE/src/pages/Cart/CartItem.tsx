import { Box, Divider, Stack, Typography } from '@mui/material'
import type { UserCartResponse } from '../../types/types';
import CartItemRow from './CartItemRow';
import { useMutation } from '@tanstack/react-query';
import { deleteAllCartItemsApi } from '../../services/cartService';
import { queryClient } from '../../main';

export default function CartItem({ userCart, selectedProducts, setSelectedProducts }:
    {
        userCart: UserCartResponse[] | undefined,
        selectedProducts: number[],
        setSelectedProducts: React.Dispatch<React.SetStateAction<number[]>>
    }) {
    const deleteAllItem = useMutation({
        mutationFn: (guestToken: string | null) => deleteAllCartItemsApi(
            guestToken
        ),
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
            console.error("Error deleting all cart items:", error);
        }
    });
    const allSelected = (userCart?.length && userCart.length > 0 && userCart.every((item) => selectedProducts.includes(item.cartItemId))) || false;
    return (
        <Box>
            <Typography sx={{
                fontSize: { xs: "1rem", lg: "35px" },
                fontWeight: 600,
                letterSpacing: "-1px",
            }}>
                Giỏ hàng
            </Typography>
            <Box sx={{
                mt: 2
            }}>
                <Stack direction={"row"}
                    sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                    <Stack direction={"row"}
                        onClick={() => {
                            if (allSelected) {
                                setSelectedProducts([]);
                            } else {
                                setSelectedProducts(userCart?.map(item => item.cartItemId) || []);
                            }
                        }}
                        sx={{
                            gap: 1, alignItems: "center",
                            cursor: "pointer"
                        }}>
                        <Stack direction={"row"}
                            sx={{
                                width: { xs: "30px", lg: "20px" },
                                aspectRatio: "1/1",
                                border: "2px solid",
                                borderColor: allSelected ? "#3f3ddd" : "#a9a9acff",
                                borderRadius: "5px",
                                alignItems: "center",
                                justifyContent: "center",
                            }}>
                            <Box
                                sx={{
                                    width: "75%",
                                    aspectRatio: "1/1",
                                    backgroundColor: allSelected ? "#3f3ddd" : "transparent",
                                    borderRadius: "2px",
                                }}
                            />
                        </Stack>
                        <Typography sx={{
                            fontSize: { xs: "0.8rem", lg: "15px" },
                            fontWeight: 600,
                            color: "#565657ff",
                            letterSpacing: "-0.5px",
                        }}>
                            Tất cả sản phẩm
                        </Typography>
                    </Stack>
                    <Typography
                        onClick={() => {
                            const guestToken = localStorage.getItem("guestToken") || null;
                            deleteAllItem.mutate(guestToken);
                        }}
                        sx={{
                            fontSize: { xs: "0.8rem", lg: "13px" },
                            fontWeight: 600,
                            color: "#565657ff",
                            cursor: "pointer",
                            letterSpacing: "-0.5px",
                        }}>
                        Xoá tất cả
                    </Typography>
                </Stack>
                <Divider sx={{
                    borderColor: '#b79e9eff',
                    mt: 2
                }} />
                {/* items */}
                <Stack direction={"column"}>
                    {
                        userCart?.map((item, index) => (
                            <CartItemRow key={index} item={item} selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts} />
                        ))
                    }
                </Stack>
            </Box>
        </Box>
    )
}
