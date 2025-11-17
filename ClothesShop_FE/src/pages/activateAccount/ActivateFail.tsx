import { faEnvelope, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Container, Stack, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { resendActivationEmailApi } from "../../services/authService";
import Swal from "sweetalert2";

export default function ActivateFail({message, token} : { message: string, token: string }) {    
    const navigate = useNavigate();
    const resendActivationEmail = useMutation({
        mutationFn: resendActivationEmailApi,
        onSuccess: () => {
            Swal.fire({
                title: "Gửi lại email xác thực thành công!",
                text: "Vui lòng kiểm tra hộp thư đến của bạn.",
                icon: "success",
                confirmButtonText: "OK",
            }).then(() => {
                navigate("/account/re-activate?token=" + token);
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
    })
    return (
        <Container sx={{
            width: "40%",
            boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)",
            mt: 4,
            borderRadius: "10px",
            border: "1px solid #E0E0E0",
            p: 4,
            backgroundColor: "#fff",
        }}>
            <Stack direction={"column"}
                sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2
                }}>
                <FontAwesomeIcon icon={faTriangleExclamation}
                    style={{
                        color: "#D12022",
                        fontSize: "70px"
                    }} />
                <Typography variant="h5" sx={{
                    fontWeight: 600,
                }}>
                    Xác thực tài khoản thất bại!
                </Typography>
                <Typography variant="h6" sx={{
                    fontWeight: 500,
                    fontSize: { lg: "14px" },
                    textAlign: "center",
                }}>
                    Đường dẫn xác thực không hợp lệ hoặc đã hết hạn. Vui lòng thử lại hoặc yêu cầu gửi lại email xác thực.
                </Typography>
                <Stack direction={"row"}
                    sx={{
                        backgroundColor: "#FDF2F2",
                        borderRadius: "10px",
                        p: 2,
                        width: "100%",
                        gap: 3,
                        border: "1px solid rgb(255, 188, 188)",
                    }}
                >
                    <FontAwesomeIcon size="2xl" icon={faTriangleExclamation} style={{ color: "#D12022", }} />
                    <Stack direction={"column"} sx={{
                        gap: 1,
                    }}>
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            fontSize: { lg: "16px" },
                            color: "#941C1E"
                        }}>
                            Email chưa được xác thực
                        </Typography>
                        <Typography variant="h6" sx={{
                            fontWeight: 500,
                            fontSize: { lg: "14px" },
                            color: "#B1181B"
                        }}>
                            {message}
                        </Typography>
                    </Stack>
                </Stack>
                <Button variant="contained" fullWidth
                loading={resendActivationEmail.isPending}
                onClick={() => resendActivationEmail.mutate(token)}
                    startIcon={<FontAwesomeIcon size="2xl" icon={faEnvelope} style={{ marginRight: 10, }} />}>
                    Gửi lại email xác thực
                </Button>
                <Button variant="outlined" fullWidth sx={{ mt: -1 }}
                onClick={() => navigate("/")}>
                    Quay lại trang đăng nhập
                </Button>
            </Stack>
        </Container>
    )
}
