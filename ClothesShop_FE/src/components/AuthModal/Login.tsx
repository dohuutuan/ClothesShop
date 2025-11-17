/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, Box, Button, Container, Stack, TextField, Typography } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { loginApi, resendEmailApi } from "../../services/authService";
import {  useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../store/slices/authSlice";
import { Bounce, toast } from 'react-toastify';
import type { LoginData, LoginProps } from "../../types/types";
import Swal from "sweetalert2";
import Loading from "../Loading/Loading";

const schema = yup.object({
    account: yup.string().required("Email/SĐT không được để trống"),
    password: yup.string().required("Mật khẩu không được để trống")
        .matches(/^[a-zA-Z0-9]{6,16}$/, "Mật khẩu phai hợp lệ từ 6 đến 16 ký tự và không có dấu"),
});

export default function Login({ setIsLogin, handleClose, setOpenForgotPasswordModal }: LoginProps) {
    const [account, setAccount] = useState<string | null>(null);
    const [loginError, setLoginError] = useState<string | null>(null);
    const dispatch = useDispatch();

    const resendMailMutation = useMutation({
        mutationFn: resendEmailApi,
        onSuccess: () => {
            setLoginError(null);
            setAccount(null);
            handleClose();
            Swal.fire({
                title: "Gửi lại email xác thực thành công!",
                text: "Vui lòng kiểm tra hộp thư đến của bạn.",
                icon: "success",
                confirmButtonText: "OK",
            });
        },
        onError: (error) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const errorMessage = (error as any)?.response?.data?.message || "Lỗi không xác định";
            Swal.fire({
                title: "Lỗi",
                text: errorMessage,
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    });
    const loginFunc = (data: any) => {
        localStorage.setItem("accessToken", data.accessToken);
        dispatch(login(null));
        setLoginError(null);
        handleClose();
    }
    const { handleSubmit, register, getValues, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    const loginMutation = useMutation({
        mutationFn: loginApi,
        onSuccess: (data) => {
            loginFunc(data);
            toast.success('Đăng nhập thành công!', {
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
        onError: (e: any) => {
            if (e?.response?.status === 403) {
                setAccount(getValues("account"));
            }
            setLoginError(
                e?.response?.data?.message
                    ? e.response.data.message
                    : "Server Error, Please try again"
            );
        }
    });
    const onSubmit = (data: LoginData) => {
        loginMutation.mutate(data);
    }
    if (resendMailMutation.isPending) {
        return <Loading/>
    }
    return (
        <Box sx={{ pt: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, }}>
                Đăng nhập
            </Typography>
            <Container sx={{ pt: 2 }}>
                {loginError && <Alert variant="filled" severity="error" sx={{ mb: 2 }}>
                    {loginError} {account && <span
                        style={{ textDecoration: "underline", cursor: "pointer" }}
                        onClick={() => resendMailMutation.mutate(account)}>
                        Gửi lại email xác thực
                    </span>}
                </Alert>}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack direction={"column"} gap={2} sx={{ alignItems: "center", pt: 2 }}>
                        <TextField label="Email/SĐT của bạn"
                            {...register("account")}
                            error={!!errors.account}
                            helperText={errors.account ? errors.account.message : ""}
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
                            loading={loginMutation.isPending}
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
                            Đăng nhập
                        </Button>
                    </Stack>
                </form>
            </Container>

            <Stack direction={"row"} gap={1} sx={{ justifyContent: "space-between", pt: 2 }}>
                <Typography
                    onClick={() => setIsLogin(false)}
                    sx={{ fontWeight: 500, color: "#00008B", cursor: "pointer" }}>
                    Đăng kí
                </Typography>
                <Typography
                    onClick={() =>{
                        handleClose();
                        setOpenForgotPasswordModal(true);
                    }}
                    sx={{ fontWeight: 500, color: "#00008B", cursor: "pointer" }}>
                    Quên mật khẩu
                </Typography>
            </Stack>
        </Box>
    )
}
