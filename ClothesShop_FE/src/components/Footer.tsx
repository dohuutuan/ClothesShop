import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import phone from "../assets/phone.png";
import email from "../assets/email.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faTiktok, faYoutube } from "@fortawesome/free-brands-svg-icons";
import "./styles/footer.scss";
import { Link } from "react-router-dom";
const logos = [
    {
        logo: faFacebook,
        link: "https://facebook.com/",
        color: "#ffffff"
    },
    {
        logo: faTiktok,
        link: "https://tiktok.com/",
        color: "#ffffff"
    },
    {
        logo: faYoutube,
        link: "https://youtube.com/",
        color: "#ffffff"
    },
    {
        logo: faInstagram,
        link: "https://instagram.com/",
        color: "#ffffff"
    },
]

const footerInfo = [
    {
        title: "VỀ ZEST",
        content: [
            { title: "Giới thiệu", link: "/gioi-thieu" },
            { title: "Chính sách bảo mật", link: "/chinh-sach-bao-mat" },
            { title: "Điều khoản sử dụng", link: "/dieu-khoan" },
            { title: "Chính sách đổi trả", link: "/doi-tra" },
            { title: "Chính sách vận chuyển", link: "/van-chuyen" },
            { title: "Hệ thống cửa hàng", link: "/cua-hang" }
        ]
    },
    {
        title: "HỖ TRỢ KHÁCH HÀNG",
        content: [
            { title: "Hướng dẫn mua hàng", link: "/huong-dan-mua-hang" },
            { title: "Hướng dẫn thanh toán", link: "/thanh-toan" },
            { title: "Hướng dẫn đổi trả", link: "/doi-tra-hang" },
            { title: "Hướng dẫn bảo hành", link: "/bao-hanh" }
        ]
    },
    {
        title: "KIẾN THỨC MẶC ĐẸP",
        content: [
            { title: "Góp ý, khiếu nại", link: "/gop-y" },
            { title: "Tuyển dụng", link: "/tuyen-dung" }
        ]
    }
];


const addresses = [
    "Văn phòng Hà Nội: Tầng 3 Tòa nhà BMM, KM2, Đường Phùng Hưng, Phường Phúc La, Quận Hà Đông, TP Hà Nội",
    "Trung tâm vận hành Hà Nội: Lô C8, KCN Lại Yên, Xã Lại Yên, Huyện Hoài Đức, Thành phố Hà Nội",
    "Trung tâm R&D: T6-01, The Manhattan Vinhomes Grand Park, Long Bình, TP. Thủ Đức",
    "Văn phòng và Trung tâm vận hành TP. HCM: Lô C3, đường D2, KCN Cát Lái, Thạnh Mỹ Lợi, TP. Thủ Đức, TP. Hồ Chí Minh.",
]
function Footer() {
    return (
        <Box className="footer"
            sx={{
                bgcolor: "black",
                py: 3,
                px: 2,
            }} >
            <Grid container sx={{gap:{xs:3, lg:0}}}>
                <Grid size={{ lg: 4, xs: 12 }}>
                    <Box>
                        <Typography variant="h6" color="text.secondary"
                            sx={{ fontWeight: 700 }}>
                            ZEST lắng nghe bạn!
                        </Typography>
                        <Typography color="text.secondary"
                            sx={{ fontSize: "0.7rem" }}>
                            Chúng tôi luôn trân trọng và mong đợi nhận được mọi ý kiến đóng góp từ khách hàng để có thể nâng cấp trải nghiệm dịch vụ và sản phẩm tốt hơn nữa.
                        </Typography>
                    </Box>
                </Grid>
                <Grid size={{ lg: 4, xs: 12 }}>
                    <Box sx={{ px: 11 }}>
                        <Stack direction={"column"} sx={{ gap: 2 }}>
                            <Stack direction={"row"} sx={{ gap: 2, alignItems: "center" }}>
                                <Box sx={{ height: "2.5rem" }}>
                                    <img src={phone} style={{ width: "100%", height: "100%" }} />
                                </Box>
                                <Box >
                                    <Typography variant="h6" color="text.secondary"
                                        sx={{ fontWeight: 700 }}>
                                        1900 8888
                                    </Typography>
                                    <Typography color="text.secondary"
                                        sx={{ fontSize: "0.7rem" }}>
                                        Thời gian làm việc: 8h - 22h
                                    </Typography>
                                </Box>
                            </Stack>
                            <Stack direction={"row"} sx={{ gap: 2, alignItems: "center" }}>
                                <Box sx={{ height: "2.5rem" }}>
                                    <img src={email} style={{ width: "100%", height: "100%" }} />
                                </Box>
                                <Box >
                                    <Typography variant="h6" color="text.secondary"
                                        sx={{ fontWeight: 700 }}>
                                        Email
                                    </Typography>
                                    <Typography color="text.secondary"
                                        sx={{ fontSize: "0.7rem" }}>
                                        zest@gmail.com
                                    </Typography>
                                </Box>
                            </Stack>
                        </Stack>
                    </Box>
                </Grid>
                <Grid size={{ lg: 4, xs: 12 }}>
                    <Stack direction={"column"} sx={{ gap: 2, alignItems: "center" }}>
                        <Typography color="text.secondary">Kết nối với chúng tôi qua:</Typography>
                        <Stack direction={"row"} sx={{ gap: 2 }}>
                            {
                                logos.map((item, index) => (
                                    <FontAwesomeIcon key={index} icon={item.logo} size="2xl"
                                        className="footer-icon"
                                        style={{
                                            cursor: "pointer",
                                        }}
                                        onClick={() => window.location.href = item.link} />
                                ))
                            }
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>
            <Divider sx={{
                borderColor: '#ffffff', my: 5
            }} />
            <Grid container sx={{gap:{xs:3,lg:0}}}>
                {
                    footerInfo.map((item, index) => (
                        <Grid key={index} size={{ lg: 3, xs: 12 }} sx={{ px: 2, }}>
                            <Stack direction={"column"} sx={{ gap: 2 }}>
                                <Typography color="text.secondary"
                                    sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
                                    {item.title}
                                </Typography>
                                {
                                    item.content.map((content, index) => (
                                        <Link key={index} className="footer-link" to={content.link}>
                                            <Typography color="text.secondary"
                                                className="footer-link"
                                                sx={{ fontSize: "0.8rem", }}>
                                                {content.title}
                                            </Typography>
                                        </Link>
                                    ))
                                }
                            </Stack>
                        </Grid>
                    ))
                }
                <Grid size={{ lg: 3, xs: 12 }} sx={{ px: 2 }}>
                    <Stack direction={"column"} sx={{ gap: 2 }}>
                        <Typography color="text.secondary"
                            sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
                            ĐỊA CHỈ LIÊN HỆ
                        </Typography>
                        {
                            addresses.map((content, index) => (
                                <Typography key={index} color="text.secondary"
                                    sx={{ fontSize: "0.8rem" }}>
                                    {content}
                                </Typography>
                            ))
                        }
                    </Stack>

                </Grid>
            </Grid>
            <Divider sx={{
                borderColor: '#ffffff', my: 5
            }} />
            <Stack direction={"row"} sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <Typography color="text.secondary"
                    sx={{ fontSize: "0.8rem" }}>
                    © 2023 Zest. All rights reserved.
                </Typography>
                <Stack direction={"row"} sx={{ gap: 2 }}>
                    <Typography color="text.secondary"
                        sx={{ fontSize: "0.8rem" }}>
                        Thiết kế bởi Zest
                    </Typography>
                    <Typography color="text.secondary"
                        sx={{ fontSize: "0.8rem" }}>
                        Phát triển bởi Zest
                    </Typography>
                </Stack>
            </Stack>
        </Box>
    );
}

export default Footer;