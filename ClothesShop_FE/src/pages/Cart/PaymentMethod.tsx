import { Box, Stack, Typography } from '@mui/material'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import WalletIcon from '@mui/icons-material/Wallet';
import CreditCardIcon from '@mui/icons-material/CreditCard';
const methods = [
    {
        icon: <LocalShippingOutlinedIcon sx={{ fontSize: { xs: "1.5rem", lg: "40px" } }} />,
        name: "Thanh toán khi nhận hàng",
        value: "cod"
    },
    {
        icon: <WalletIcon sx={{ fontSize: { xs: "1.5rem", lg: "40px" } }} />,
        name: "Ví Momo",
        value: "momo"
    },
    {
        icon: <CreditCardIcon sx={{ fontSize: { xs: "1.5rem", lg: "40px" } }} />,
        name: "Thanh toán qua VNPAY",
        value: "vnpay"
    }
]

export default function PaymentMethod({ selectedPaymentMethod, setSelectedPaymentMethod } : {
    selectedPaymentMethod: string;
    setSelectedPaymentMethod: (method: string) => void;
}) {
    return (
        <Stack direction={"column"}
            sx={{
                gap: 1,

            }}>
            {
                methods.map((method, index) => (
                    <Stack key={index} direction={"row"}
                    onClick={() => setSelectedPaymentMethod(method.value)}
                        sx={{
                            border: "1px solid #c7b6b6ff",
                            borderRadius: "10px",
                            px: 2,
                            py: 1,
                            alignItems: "center",
                            gap: 2,
                            cursor: "pointer",
                            "&:hover": {
                                bgcolor: "#F2F2F2"
                            }
                        }}
                    >
                        <Box>
                            <Stack direction={"row"}
                                sx={{
                                    width: { xs: "30px", lg: "20px" },
                                    aspectRatio: "1/1",
                                    border: "1px solid black",
                                    borderRadius: "9999px",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                <Box
                                    sx={{
                                        width: "50%",
                                        aspectRatio: "1/1",
                                        backgroundColor: selectedPaymentMethod === method.value ? "#3f3ddd" : "transparent",
                                        borderRadius: "9999px",
                                    }}
                                />
                            </Stack>
                        </Box>
                        {method.icon}
                        <Typography sx={{
                            fontSize: { xs: "0.8rem", lg: "15px" },
                            fontWeight: 700,
                            color: "black",
                            letterSpacing: "-1px",
                        }}>
                            {method.name}
                        </Typography>
                    </Stack>
                ))
            }

        </Stack>
    )
}
