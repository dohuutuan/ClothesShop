import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import { Box, Grid, Stack, Typography } from "@mui/material";
const attribute = [
    {
        icon: <LocalShippingOutlinedIcon
            sx={{
                fontSize: { xs: "1.5rem", lg: "60px" },
            }} />,
        name: "Miễn phí vận chuyển",
        description: "Áp dụng cho mọi đơn hàng từ 500k"
    },
    {
        icon: <ChangeCircleOutlinedIcon sx={{
            fontSize: { xs: "1.5rem", lg: "60px" },
        }} />,
        name: "Đổi hàng dễ dàng",
        description: "7 ngày đổi hàng vì bất kì lí do gì"
    },
    {
        icon: <SupportAgentIcon
            sx={{
                fontSize: { xs: "1.5rem", lg: "60px" },
            }} />,
        name: "Hỗ trợ nhanh chóng",
        description: "HOTLINE 24/7 : 0123456789"
    },
    {
        icon: <PaymentsOutlinedIcon
            sx={{
                fontSize: { xs: "1.5rem", lg: "60px" },
            }} />,
        name: "Thanh toán đa dạng",
        description: "Thanh toán khi nhận hàng, Napas, Visa, Chuyển Khoản"
    }
]
export default function Privilege() {

    return (
        <Box sx={{
            backgroundColor: "white",
            px: 4,
            py: 4
        }}>
            <Grid container spacing={2}>
                {attribute.map((item) => (
                    <>
                        <Grid size={3}>
                            <Grid container>
                                <Grid size={3}>
                                    {item.icon}
                                </Grid>
                                <Grid size={9} sx={{
                                    display: "flex",
                                    alignItems: "center",
                                }}>
                                    <Stack direction={"column"} >
                                        <Typography
                                            sx={{
                                                fontSize: {
                                                    xs: "12px", lg: "15px",
                                                    fontWeight: 500
                                                },
                                                letterSpacing: "-0.5px",
                                            }}>
                                            {item.name}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: {
                                                    xs: "10px", lg: "13px",
                                                    fontWeight: 400
                                                },
                                                letterSpacing: "-0.5px",
                                            }}>
                                            {item.description}
                                        </Typography>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Grid>
                    </>
                ))}
            </Grid>

        </Box>
    )
}
