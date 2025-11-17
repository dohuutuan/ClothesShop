import { Box, IconButton, Modal, Typography, Stack, Grid, Slide } from "@mui/material";
import Login from "./Login";
import zest from "../../assets/zest.png";
import { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import voucher from "../../assets/voucher.png";
import shirt from "../../assets/shirt.png";
import delivery from "../../assets/delivery.png";
import Register from "./Register";
const banners = [
    {
        title: "Voucher ưu đãi",
        logo: voucher,
    },
    {
        title: "Sản phẩm chất lượng",
        logo: shirt,
    },
    {
        title: "Giao hàng nhanh chóng",
        logo: delivery,
    }
]
export default function AuthModal({ open, handleClose, setOpenForgotPasswordModal }:
    { open: boolean, handleClose: () => void, setOpenForgotPasswordModal: (value: boolean) => void }) {
    const [isLogin, setIsLogin] = useState<boolean>(true);
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
                            height: "33rem",
                            backgroundColor: "white",
                            position: "absolute",
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
                            <Box sx={{ height: "3rem", overflow: "hidden" }}>
                                <img src={zest} alt="" style={{ height: "100%", width: "40%", objectFit: "cover" }} />
                            </Box>
                            <Typography variant="h5" sx={{ fontWeight: 700, fontSize: "1.8rem", py: 2 }}>
                                Rất nhiều đặc quyền và quyền lợi mua sắm đang chờ bạn
                            </Typography>
                            <Grid container>
                                {
                                    banners.map((item, index) => (<Grid size={4} >
                                        <Box sx={{ p: 0.6, }} key={index}>
                                            <Stack direction={"row"}
                                                sx={{
                                                    border: "1.5px solid gray",
                                                    p: 1,
                                                    borderRadius: "10px",
                                                    alignItems: "center",
                                                    gap: 1.3,
                                                    minHeight: "5.3rem"
                                                }}>
                                                <Box sx={{ width: "35%" }}>
                                                    <img src={item.logo} style={{
                                                        width: "100%",
                                                        height: "100%"
                                                    }} />
                                                </Box>
                                                <Typography sx={{
                                                    maxWidth: "65%",
                                                    fontSize: "0.9rem",
                                                    fontWeight: 600,
                                                }}>
                                                    {item.title}
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    </Grid>))
                                }
                            </Grid>
                            {
                                isLogin ? <Login setIsLogin={setIsLogin}
                                    handleClose={handleClose}
                                    setOpenForgotPasswordModal={setOpenForgotPasswordModal} />
                                    : <Register setOpenForgotPasswordModal={setOpenForgotPasswordModal} setIsLogin={setIsLogin} handleClose={handleClose} />
                            }
                        </Box>
                    </Box>
                </Slide>
            </Modal>
        </div>
    )
}
