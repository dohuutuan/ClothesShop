import { Box, Button, Container, IconButton, Modal, Slide, Stack, TextField, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import { forgotPasswordApi } from "../../services/authService";
import { useMutation } from "@tanstack/react-query";
const schema = yup.object({
    account: yup.string().required("Email/SĐT không được để trống"),
});
export default function ForgotPasswordModal({ open, handleClose }:
    { open: boolean, handleClose: () => void }) {
    const { handleSubmit, register, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    const mutate = useMutation({
        mutationFn: forgotPasswordApi,
        onSuccess: () => {
            handleClose();
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Yêu cầu đặt lại mật khẩu đã được gửi thành công. Vui lòng kiểm tra email hoặc số điện thoại của bạn.',
            });
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            handleClose();
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: error?.response?.data?.message || "Đã xảy ra lỗi khi gửi yêu cầu đặt lại mật khẩu",
            });
        }
    });
    const onSubmit = (data: { account: string }) => {
        mutate.mutate(data);
    }

    return (
        <div>
            <Modal open={open} onClose={handleClose} >
                <Slide direction="up" in={open} mountOnEnter unmountOnExit>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "center",
                        pt: 3
                    }}>
                        <Box sx={{
                            width: "35rem",
                            backgroundColor: "white",
                            position: "absolute",
                            top: "20%",
                            borderRadius: "10px",
                            padding: "2rem",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                            overflowY: "auto"
                        }}>
                            <IconButton
                                onClick={handleClose}
                                sx={{ position: "absolute", top: 8, right: 8 }}
                            >
                                <CloseIcon />
                            </IconButton>

                            <Box sx={{ pt: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, }}>
                                    Cấp lại mật khẩu
                                </Typography>
                                <Container sx={{ pt: 2 }}>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <Stack direction={"column"} gap={2}
                                            sx={{ alignItems: "center", pt: 2 }}>
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
                                            <Button variant="contained"
                                            loading={mutate.isPending}
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
                                                Gửi yêu cầu
                                            </Button>
                                        </Stack>
                                    </form>
                                </Container>
                            </Box>
                        </Box>
                    </Box>
                </Slide>
            </Modal>
        </div>
    )
}
