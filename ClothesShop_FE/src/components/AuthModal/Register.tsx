import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Alert, Box, Button, Container, Stack, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { registerApi } from '../../services/authService';
import type { LoginProps, RegisterData } from '../../types/types';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
const schema = yup.object({
    fullName: yup.string().required("Tên không được để trống"),
    email: yup.string().email("Email không hợp lệ").required("Email không được để trống"),
    phone: yup.string().required("SĐT không được để trống").matches(/^0\d{9}$/, "SĐT không hợp lệ"),
    password: yup.string().required("Mật khẩu không được để trống")
        .matches(/^[a-zA-Z0-9]{6,16}$/, "Mật khẩu phai hợp lệ từ 6 đến 16 ký tự và không có dấu"),
});
export default function Register({ setIsLogin, handleClose }: LoginProps) {
    const [registerError, setRegisterError] = useState<string | null>(null);
    const { handleSubmit, register, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    const registerMutation = useMutation({
        mutationFn: registerApi,
        onSuccess: () => {
            handleClose();
            Swal.fire({
                title: "Đăng kí thành công",
                text: "Chúng tôi đã gửi email xác nhận đến địa chỉ email của bạn. Vui lòng kiểm tra email để xác thực tài khoản.",
                icon: "success"
            });
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (e: any) => {
            setRegisterError(
                e?.response?.data?.message
                    ? e.response.data.message
                    : "Server Error, Please try again"
            );
        }
    });

    const onSubmit = (data: RegisterData) => {
        registerMutation.mutate(data);
    }
    return (
        <Box sx={{ pt: 1 }} >
            <Typography variant="h6" sx={{ fontWeight: 700, }}>
                Đăng kí
            </Typography>
            <Container sx={{ pt: 2 }}>
                {
                    registerError &&
                    <Alert variant="filled" severity="error">
                        {registerError}
                    </Alert>
                }
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack direction={"column"} gap={2} sx={{ alignItems: "center", pt: 2 }}>
                        <Stack direction={"row"} sx={{ gap: 2, width: "100%" }}>
                            <TextField label="Tên của bạn"
                                {...register("fullName")}
                                error={!!errors.fullName}
                                helperText={errors.fullName ? errors.fullName.message : ""}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "40px",
                                        px: 1,
                                    },
                                    "& .MuiInputLabel-root": {
                                        color: "gray",
                                        pl: 1
                                    },
                                    width: "50%",
                                }} />
                            <TextField label="SĐT của bạn"
                                {...register("phone")}
                                error={!!errors.phone}
                                helperText={errors.phone ? errors.phone.message : ""}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "40px",
                                        px: 1,
                                    },
                                    "& .MuiInputLabel-root": {
                                        color: "gray",
                                        pl: 1
                                    },
                                    width: "50%",
                                }} />
                        </Stack>
                        <TextField label="Email của bạn"
                            {...register("email")}
                            error={!!errors.email}
                            helperText={errors.email ? errors.email.message : ""}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "40px",
                                    px: 1,
                                },
                                "& .MuiInputLabel-root": {
                                    color: "gray",
                                    pl: 1
                                },
                                width: "100%",
                            }} />
                        <TextField label="Mật khẩu"
                            error={!!errors.password}
                            helperText={errors.password ? errors.password.message : ""}
                            type="password"
                            {...register("password")}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "40px",
                                    px: 1,
                                },
                                "& .MuiInputLabel-root": {
                                    color: "gray",
                                    pl: 1
                                },
                                width: "100%",
                            }} />

                        <Button variant="contained"
                        loading={registerMutation.isPending}
                            type="submit"
                            color="primary"
                            size="large"
                            sx={{
                                width: "100%", borderRadius: "40px",
                                '&:hover': {
                                    backgroundColor: '#d3d3d3',
                                    color: '#000000'
                                }
                            }} >
                            Đăng kí
                        </Button>
                    </Stack>
                </form>

            </Container>

            <Typography
                onClick={() => setIsLogin(true)}
                sx={{
                    fontWeight: 500,
                    color: "#00008B",
                    cursor: "pointer",
                    pt: 2
                }}>
                Đăng nhập
            </Typography>

        </Box>
    )
}
