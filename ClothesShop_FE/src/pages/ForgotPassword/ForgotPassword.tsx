import * as yup from "yup";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import type { ForgotPassInput } from "../../types/types";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const schema = yup.object({
    password: yup.string().required("Mật khẩu không được để trống")
        .matches(/^[a-zA-Z0-9]{6,16}$/, "Mật khẩu phai hợp lệ từ 6 đến 16 ký tự và không có dấu"),
    confirmPassword: yup.string().required("Mật khẩu không được để trống")
        .matches(/^[a-zA-Z0-9]{6,16}$/, "Mật khẩu phai hợp lệ từ 6 đến 16 ký tự và không có dấu"),
    token: yup.string().required(),
});
export default function ForgotPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const { handleSubmit, register, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    const forgotMutation = useMutation({
        mutationFn: async (data: ForgotPassInput) => {
            console.log("Submitting forgot password data:", data);
            
        },
        onSuccess: () => {
            Swal.fire({
                title: "Thành công",
                text: "Mật khẩu đã được đặt lại thành công",
                icon: "success",
                confirmButtonText: "OK",
            }).then(() => {
                navigate("/");
            });
        },
        onError: (error) => {
            Swal.fire({
                title: "Lỗi",
                text: error instanceof Error ? error.message : "Đã xảy ra lỗi khi đặt lại mật khẩu",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    });
    const onSubmit = (data: ForgotPassInput) => {
        forgotMutation.mutate(data);
    };
    return (
        <Box sx={{ py: 4 }}>
            <Typography variant="h1" sx={{
                textAlign: "center",
                fontSize: { xs: "2rem", lg: "30px" },
                fontWeight: 500
            }}>
                Đặt lại mật khẩu
            </Typography>
            <Container
                sx={{
                    width: { xs: "90%", lg: "40%" }, mt: 4
                }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Hidden Token Field */}
                    <input
                        type="hidden"
                        value={token || ""}
                        {...register("token")}
                    />
                    <TextField variant="outlined"
                        label="Mật khẩu"
                        fullWidth
                        sx={{
                            mb: 2,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "40px",
                                px: 1,
                            },
                        }}
                        {...register("password")}
                        error={!!errors.password}
                        helperText={errors.password ? errors.password.message : ""}
                    />
                    <TextField variant="outlined"
                        label="Xác nhận mật khẩu"
                        fullWidth
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "40px",
                                px: 1,
                            },
                            mb: 2
                        }}
                        {...register("confirmPassword")}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword ? errors.confirmPassword.message : ""}
                    />
                    <Button variant="contained"
                        type="submit"
                        size="large"
                        sx={{ borderRadius: "40px" }}
                        color="primary"
                        fullWidth>
                        Gửi yêu cầu
                    </Button>
                </form>
            </Container>

        </Box>

    )
}
