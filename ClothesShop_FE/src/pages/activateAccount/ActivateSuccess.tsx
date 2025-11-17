import { faCircleCheck, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Container, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ActivateSuccess() {
    const navigate = useNavigate();
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
                    <FontAwesomeIcon icon={faCircleCheck}
                        style={{
                            color: "#00ff1e",
                            fontSize: "70px"
                        }} />
                    <Typography variant="h5" sx={{
                        fontWeight: 600,
                    }}>
                        Xác thực tài khoản thành công!
                    </Typography>
                    <Typography variant="h6" sx={{
                        fontWeight: 500,
                        fontSize: { lg: "14px" },
                        textAlign: "center",
                    }}>
                        Tài khoản của bạn đã được kích hoạt thành công. Bạn có thể bắt đầu sử dụng dịch vụ ngay bây giờ.
                    </Typography>
                    <Stack direction={"row"}
                        sx={{
                            backgroundColor: "#F1FDF4",
                            borderRadius: "10px",
                            p: 2,
                            width: "100%",
                            gap: 3,
                            border: "1px solid rgb(186, 240, 187)",
                        }}
                    >
                        <FontAwesomeIcon size="2xl" icon={faEnvelope} style={{ color: "#2bff00", }} />
                        <Stack direction={"column"} sx={{
                            gap: 1,

                        }}>
                            <Typography variant="h6" sx={{
                                fontWeight: 600,
                                fontSize: { lg: "16px" },
                                color: "#266532"
                            }}>
                                Email đã được xác thực
                            </Typography>
                            <Typography variant="h6" sx={{
                                fontWeight: 500,
                                fontSize: { lg: "14px" },
                                color: "#418D4D"
                            }}>
                                Địa chỉ email của bạn đã được xác nhận và tài khoản đã sẵn sàng sử dụng.
                            </Typography>
                        </Stack>
                    </Stack>
                    <Button variant="contained" fullWidth
                    onClick={() => navigate("/")}>Đăng nhập ngay</Button>
                </Stack>
            </Container>
    )
}
