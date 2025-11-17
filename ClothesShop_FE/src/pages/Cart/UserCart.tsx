/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Grid, Stack, Typography } from "@mui/material";
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import OrderForm from "./OrderForm";
import * as yup from "yup";
import CartItem from "./CartItem";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserCartApi } from "../../services/cartService";
import Loading from "../../components/Loading/Loading";
import { useSelector } from "react-redux";
import type { UserCartResponse } from "../../types/types";
import { useMemo, useState } from "react";
import { formatMoney } from "../../utils/functions";
import { orderApi } from './../../services/productService';
import { Box, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { Bounce, toast } from "react-toastify";
import { queryClient } from "../../main";
const schema = yup.object({
    fullName: yup.string().required("Họ và tên không được để trống"),
    phone: yup.string().required("Số điện thoại không được để trống")
        .matches(/^[0-9]{10}$/, "Số điện thoại phải hợp lệ"),
    email: yup.string().email("Email không hợp lệ").required("Email không được để trống"),
    address: yup.string().required("Địa chỉ không được để trống"),
    province: yup.object().required("Vui lòng chọn tỉnh/thành phố"),
    district: yup.object().required("Vui lòng chọn quận/huyện"),
    ward: yup.object().required("Vui lòng chọn phường/xã"),
});
export default function UserCart() {
    const isLogin = useSelector((state: any) => state.auth.login);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("cod");
    const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
    const { handleSubmit, register, control, setValue, getValues, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    const guestToken = isLogin == true ? null : localStorage.getItem("guestToken");
    const { data: userCart, isPending } = useQuery<UserCartResponse[]>({
        queryKey: ["userCart", guestToken],
        queryFn: () => getUserCartApi(guestToken),
        enabled: !!guestToken || !!isLogin, // Enable for both guests and logged-in users
    });
    const totalPrice = useMemo(() => {
        return (userCart ?? [])
            .filter(item => selectedProducts.includes(item.cartItemId))
            .reduce((sum, item) => sum + item.totalPrice, 0);
    }, [userCart, selectedProducts]);
    interface OrderConfirmation {
  orderId: string;
  orderDate: string;
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
  totalAmount: number;
  shippingFee: number;
  products: {
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
}

const [orderConfirmation, setOrderConfirmation] = useState<OrderConfirmation | null>(null);
    const orderMutation = useMutation({
        mutationFn: (data: any) => orderApi(data),
        onSuccess: (data) => {
            toast.success('Đặt hàng thành công! Email xác nhận đã được gửi đến bạn.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            }); 
            setOrderConfirmation(data);
            const guestToken = isLogin == true ? null : localStorage.getItem("guestToken");
            queryClient.invalidateQueries({ queryKey: ["userCart", guestToken] });
            queryClient.invalidateQueries({ queryKey: ["cartQuantity", guestToken] });
            reset();
        },
        onError: (error) => {
            console.log(error)
            toast.error('Đặt hàng thất bại, vui lòng thử lại sau!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            }); 
        }
    });


    const onSubmit = (data: any) => {
        const orderData = {
            ...data,
            province: data.province.id,
            district: data.district.id,
            ward: data.ward.id,
            paymentMethod: selectedPaymentMethod,
            products: selectedProducts
        };
        orderMutation.mutate(orderData);
        setSelectedProducts([]);
    };
    if (isPending || orderMutation.isPending) {
        return <Loading />;
    }
    if (orderConfirmation) {
    const {
        orderId,
        orderDate,
        province,
        district,
        ward,
        addressDetail,
        totalAmount,
        shippingFee,
        products,
    } = orderConfirmation;

    const fullAddress = `${addressDetail}, ${ward}, ${district}, ${province}`;

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", my: 5, p: 3, bgcolor: "#fff", borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, textAlign: "center", color: "#2E35B1" }}>
                Đặt hàng thành công!
            </Typography>

            <Typography sx={{ mb: 1 }}><strong>Mã đơn hàng:</strong> #{orderId}</Typography>
            <Typography sx={{ mb: 1 }}><strong>Ngày đặt:</strong> {new Date(orderDate).toLocaleString("vi-VN")}</Typography>
            <Typography sx={{ mb: 3 }}><strong>Địa chỉ nhận hàng:</strong> {fullAddress}</Typography>

            <Typography variant="h6" sx={{ mb: 2 }}>Chi tiết sản phẩm</Typography>
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell>Sản phẩm</TableCell>
                        <TableCell align="center">Số lượng</TableCell>
                        <TableCell align="right">Đơn giá</TableCell>
                        <TableCell align="right">Thành tiền</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.map((item: any, index: number) => (
                        <TableRow key={index}>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell align="center">{item.quantity}</TableCell>
                            <TableCell align="right">{item.unitPrice.toLocaleString("vi-VN")}₫</TableCell>
                            <TableCell align="right">{(item.quantity * item.unitPrice).toLocaleString("vi-VN")}₫</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", flexDirection: "column", gap: 1 }}>
                <Typography align="right"><strong>Phí vận chuyển:</strong> {formatMoney(shippingFee)}</Typography>
                <Typography align="right" sx={{ fontSize: "20px", fontWeight: 700, color: "#d32f2f" }}>
                    Tổng thanh toán: {formatMoney(totalAmount + shippingFee)}
                </Typography>
            </Box>
        </Box>
    );
}

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* form */}
                <Grid container sx={{
                    px: 4,
                    py: 3,
                    bgcolor: "white",
                }}>
                    <Grid size={6}>
                        <OrderForm register={register}
                            errors={errors}
                            control={control}
                            setValue={setValue}
                            selectedPaymentMethod={selectedPaymentMethod}
                            setSelectedPaymentMethod={setSelectedPaymentMethod}
                            getValues={getValues}
                        />
                    </Grid>
                    <Grid size={6}
                        sx={{ pl: 3 }}>
                        <CartItem userCart={userCart}
                            selectedProducts={selectedProducts}
                            setSelectedProducts={setSelectedProducts} />
                    </Grid>
                </Grid>
                {/* order bar */}
                <Grid container
                    sx={{
                        position: "fixed",
                        bottom: 0,
                        zIndex: 1000,
                        width: "100%",
                    }}>
                    <Grid size={6}>
                        <Stack direction={"row"}
                            sx={{
                                bgcolor: "#EAEBFA",
                                p: 4,
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}>
                            <Stack direction={"row"}
                                sx={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "100%",
                                }}>
                                <Stack direction={"row"}
                                    sx={{
                                        gap: 3,
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}>
                                    <LocalShippingOutlinedIcon sx={{ fontSize: "40px" }} />
                                    <Typography sx={{
                                        fontSize: { xs: "1rem", lg: "17px" },
                                        fontWeight: 600,
                                        color: "#525252",
                                        letterSpacing: "-1px",
                                    }}>
                                        Thanh toán khi nhận hàng
                                    </Typography>
                                </Stack>
                            </Stack >
                        </Stack>
                    </Grid>
                    <Grid size={6}>
                        <Stack direction={"row"}
                            sx={{
                                bgcolor: "white",
                                height: "100%",
                            }}>
                            <Stack direction={"column"}
                                sx={{
                                    width: "73%",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                <Typography sx={{
                                    fontSize: { xs: "1rem", lg: "25px" },
                                    fontWeight: 700,
                                    textAlign: "center",
                                    color: "#2E35B1",
                                }}>
                                    {formatMoney(totalPrice)}
                                </Typography>
                                <Typography sx={{
                                    fontSize: { xs: "1rem", lg: "14px" },
                                    fontWeight: 500,
                                    textAlign: "center",
                                    color: "#525252",
                                    letterSpacing: "-1px",
                                }}>
                                    Mua nhanh để có những ưu đãi tốt nhất
                                </Typography>
                            </Stack>
                            <Button sx={{
                                width: "27%",
                                height: "100%",
                                borderRadius: "0px",
                                fontSize: { xs: "1rem", lg: "16px" },
                            }}
                                disabled={selectedProducts.length === 0}
                                type="submit"
                                variant="contained">
                                ĐẶT HÀNG
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </form>
        </>
    )
}
