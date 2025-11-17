import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { resendActivationEmailApi } from "../../services/authService";
import Swal from "sweetalert2";
import { Button, Container, Stack, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

export default function ReactiveAccount() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const navigate = useNavigate();
    const [counter, setCounter] = useState(60);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (counter > 0) {
      setIsDisabled(true);
      timer = setTimeout(() => {
        setCounter((prev) => prev - 1);
      }, 1000);
    } else {
      setIsDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [counter]);

    const resendActivationEmail = useMutation({
        mutationFn: resendActivationEmailApi,
        onSuccess: () => {
            Swal.fire({
                title: "Gửi lại email xác thực thành công!",
                text: "Vui lòng kiểm tra hộp thư đến của bạn.",
                icon: "success",
                confirmButtonText: "OK",
            }).then(() => {
                setCounter(60);
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
                <FontAwesomeIcon icon={faCircleInfo}
                    style={{
                        color: "rgb(64, 195, 255)",
                        fontSize: "70px"
                    }} />
                <Typography variant="h5" sx={{
                    fontWeight: 600,
                }}>
                    Email xác thực đã được gửi!
                </Typography>
                <Typography variant="h6" sx={{
                    fontWeight: 500,
                    fontSize: { lg: "14px" },
                    textAlign: "center",
                }}>
                    Email xác thực đã được gửi đến địa chỉ email của bạn. Vui lòng kiểm tra hộp thư đến và làm theo hướng dẫn để kích hoạt tài khoản của bạn.
                </Typography>
                <Stack direction={"row"}
                    sx={{
                        backgroundColor: "rgb(224, 251, 255)",
                        borderRadius: "10px",
                        p: 2,
                        width: "100%",
                        gap: 3,
                        border: "1px solid rgb(149, 237, 250)",
                    }}
                >
                    <FontAwesomeIcon size="2xl" icon={faEnvelope}
                        style={{ color: "rgb(64, 195, 255)", }} />
                    <Stack direction={"column"} sx={{
                        gap: 1,
                    }}>
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            fontSize: { lg: "16px" },
                            color: "rgb(14, 112, 127)"
                        }}>
                            Email xác thực đã được gửi
                        </Typography>
                        <Typography variant="h6" sx={{
                            fontWeight: 500,
                            fontSize: { lg: "14px" },
                            color: "rgb(21, 136, 154)"
                        }}>
                            Vui lòng kiểm tra hộp thư đến của bạn và làm theo hướng dẫn để kích hoạt tài khoản của bạn.
                        </Typography>
                    </Stack>
                </Stack>
                <Button variant="contained" fullWidth
                    loading={resendActivationEmail.isPending}
                    onClick={() => {
                        if (token) {
                            resendActivationEmail.mutate(token);
                        } else {
                            Swal.fire({
                                title: "Lỗi",
                                text: "Token không hợp lệ hoặc không tồn tại.",
                                icon: "error",
                                confirmButtonText: "OK",
                            });
                        }
                    }}
                    startIcon={<FontAwesomeIcon size="2xl" icon={faEnvelope} 
                    style={{ marginRight: 10, }} />}
                    disabled={isDisabled}>
                    Gửi lại email xác thực {isDisabled && (<span>({counter})</span>)}
                </Button>
                <Button variant="outlined" fullWidth sx={{ mt: -1 }}
                    onClick={() => navigate("/")}>
                    Quay lại trang đăng nhập
                </Button>
            </Stack>
        </Container>
    )
}
