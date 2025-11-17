import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Container, Divider, Modal, Slide, Stack, Typography } from "@mui/material";
import { faGear, faList, faMapLocationDot, faQuestion, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { Bounce, toast } from "react-toastify";
import banner from "../../assets/profile-modal-banner.png";
import { logoutApi } from "../../services/authService";

export default function ProfileModal({ open, handleClose }: { open: boolean, handleClose: () => void }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const profile = useSelector((state: any) => state.auth.profile);
    const dispatch = useDispatch();
    const logoutFunc = async () => {
        dispatch(logout());
        await logoutApi();
        handleClose();
        toast.success('Đăng xuất thành công!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
        });
    };
    //items for the profile modal
    const profileItems = [
        {
            icon: faList,
            label: "Lịch sử mua hàng",
            action: logoutFunc,
        },
        {
            icon: faGear,
            label: "Cài đặt tài khoản",
            action: logoutFunc,
        },
        {
            icon: faMapLocationDot,
            label: "Sổ địa chỉ",
            action: logoutFunc,
        },

        {
            icon: faQuestion,
            label: "FAQ & Chính sách",
            action: logoutFunc,
        },
        {
            icon: faRightFromBracket,
            label: "Đăng xuất",
            action: logoutFunc,
        },
    ]
    return (
        <Modal open={open} onClose={handleClose} closeAfterTransition>
            <Slide direction="left" in={open} mountOnEnter unmountOnExit>
                <Box
                    sx={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: { xs: "100%", lg: "500px" },
                        bgcolor: "white",
                        overflowY: "auto",
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Container sx={{ width: "95%", py: 2 }}>
                        <Typography sx={{ fontSize: { xs: '14px', lg: "35px" } }}>
                            Hi, {profile?.fullname}
                        </Typography>
                        <Typography sx={{ fontSize: { xs: '10px', lg: "15px" }, fontWeight: "500" }}>
                            Bạn đã sẵn sàng mua sắm hôm nay chưa?
                        </Typography>
                    </Container>
                    <Divider sx={{
                        borderColor: 'gray'
                    }} />
                    <Container sx={{ width: "95%", py: 2 }}>
                        <Box sx={{
                            backgroundImage: `url(${banner})`,
                            height: { xs: "150px", lg: "200px" },
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            borderRadius: 2,
                            position: "relative",
                        }}>
                            <Box sx={{
                                position: "absolute",
                                top: "10%",
                                right: "0px",
                                maxWidth: "73%",
                            }}>
                                <Typography sx={{
                                    color: "white",
                                    fontSize: { xs: '14px', lg: "20px" },
                                    fontWeight: "600",
                                }}>
                                    Hàng ngàn những ưu đãi đang chờ bạn!
                                </Typography>
                                <Typography sx={{
                                    color: "white",
                                    fontSize: { xs: '14px', lg: "14px" },
                                    fontWeight: "500",
                                }}>
                                    Mua sắm ngay hôm nay để nhận ưu đãi với <b style={{ fontWeight: 700 }}>số lượng có hạn</b>!
                                </Typography>
                                <Button variant="contained" 
                                size="large"
                                sx={{ backgroundColor: "white",
                                    color: "black",
                                    fontWeight: "600",
                                    mt:2,
                                    borderRadius: "999px",
                                 }}>
                                    Bắt đầu mua sắm
                                </Button>
                            </Box>
                        </Box>
                        <Stack direction={"row"}
                            sx={{
                                gap: 2,
                                flexWrap: "wrap",
                                justifyContent: "flex-start",
                                mt:2
                            }}>
                            {profileItems.map((item, index) => (
                                <Stack direction={"column"}
                                    key={index}
                                    onClick={item.action}
                                    sx={{
                                        px: 1,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: { xs: "100%", lg: "calc(33.33% - 11px)" },
                                        aspectRatio: "1 / 1",
                                        backgroundColor: "#F1F1F1",
                                        gap: 2,
                                        borderRadius: "10px",
                                        cursor: "pointer",
                                        "&:hover": {
                                            backgroundColor: "black",
                                            color: "white",
                                            "& h6": {
                                                color: "white",
                                            }
                                        }
                                    }}>
                                    <FontAwesomeIcon size="2xl" icon={item.icon} />
                                    <Typography variant="h6" sx={{
                                        fontSize: { xs: '14px', lg: "14px" },
                                        textAlign: "center",
                                        fontWeight: "600",
                                    }}>
                                        {item.label}
                                    </Typography>
                                </Stack>
                            ))}


                        </Stack>
                    </Container>
                </Box>
            </Slide>
        </Modal>
    );
}
