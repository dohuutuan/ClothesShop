import { Box, Button, Stack, Typography } from "@mui/material";
const img = [
    "https://media3.coolmate.me/cdn-cgi/image/width=1800,height=1200,quality=80,format=auto/uploads/May2025/Frame_87642.jpg",
    "https://media3.coolmate.me/cdn-cgi/image/width=1800,height=1200,quality=80,format=auto/uploads/May2025/Frame_87638.jpg"
]
export default function GenderCategory() {
    return (
        <Stack direction={"row"}
            sx={{
                gap: 2,
                pt: 7,
                position: "relative",
            }}>
            {img.map((item, index) => (
                <Box key={index} sx={{
                    overflow: "hidden",
                    width: { lg: `${100 / img.length}%`, xs: "100%" },
                    height: { lg: "470px", xs: "200px" },
                    borderRadius: "3%",
                    position: "relative",
                    "& img": {
                        transition: "transform 0.7s ease",
                    },
                    "&:hover img": {
                        transform: "scale(1.05)",
                    },
                }}>
                    <img src={item}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                        }} />
                    <Stack direction={"column"}
                        sx={{
                            gap:{ lg: 2, xs: 0.5 },
                            position: "absolute",
                                bottom: "10%",
                                left: "5%",
                        }}>
                        <Typography
                            color="text.secondary"
                            sx={{
                                fontWeight: 700,
                                fontSize: { lg: "25px", xs: "10px" },
                                
                            }}>
                            WOMAN WEAR
                        </Typography>
                        <Typography
                            color="text.secondary"
                            sx={{
                                fontWeight: 700,
                                fontSize: { lg: "14px", xs: "8px" },
                            }}>
                            Dành riêng cho phái đẹp
                        </Typography>
                        <Button variant="contained"
                            sx={{
                                width: { lg: "200px", xs: "80px" },
                                height: { lg: "50px", xs: "20px" },
                                borderRadius: "9999px",
                                backgroundColor: "white",
                                color: "black",
                                fontSize: { lg: "18px", xs: "7px" },
                                fontWeight: 500,
                                "&:hover": {
                                    backgroundColor: "black",
                                    color: "white"
                                }
                            }}>
                            MUA NGAY
                        </Button>
                    </Stack>
                </Box>
            ))}


        </Stack>
    )
}
