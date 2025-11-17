import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import type { ProductDescription } from "../../types/types";
const attribute: { name: string; value: keyof ProductDescription }[] = [
    {
        name: "Công nghệ",
        value: "technology"
    },
    {
        name: "Chất liệu",
        value: "material"
    },
    {
        name: "Phong cách",
        value: "style"
    },
    {
        name: "Phù hợp",
        value: "suitableFor"
    },
    {
        name: "Tính năng",
        value: "feature"
    }
];
export default function Description({ image, description }:
    { image: string | undefined, description: ProductDescription }) {
    return (
        <Box sx={{
            backgroundColor: "#F2F2F2",
            py: 4,
            px: 18
        }}>
            <Typography variant="h4"
                sx={{
                    textAlign: "center",
                    fontWeight: "600",
                    fontSize: { xs: "1.5rem", lg: "32px" },
                }}>
                Mô tả sản phẩm
            </Typography>
            <Stack direction={"row"} sx={{ mt: 3, gap: 4 }}>
                <Box sx={{
                    width: "50%",
                    px: 1
                }}>
                    <Typography
                        sx={{
                            fontSize: { xs: "0.8rem", lg: "14px" },
                            fontWeight: "500",
                            color: "#4f4a4aff"
                        }}>
                            {description.introduction}
                        </Typography>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        {attribute.map((item) => (
                            <>
                                <Grid size={4}>
                                    <Typography
                                        sx={{
                                            fontSize: { xs: "0.8rem", lg: "12px" },
                                            fontWeight: "600",
                                            color: "#837373",
                                            textTransform: "uppercase",

                                        }}>
                                        {item.name}
                                    </Typography>
                                </Grid>
                                <Grid size={8}>
                                    <Typography sx={{
                                        fontSize: { xs: "0.8rem", lg: "14px" },
                                        fontWeight: "600",
                                        color: "#625959ff",
                                    }}>
                                        {description[item.value]}
                                    </Typography>
                                </Grid>
                                <Grid size={12}>
                                    <Divider sx={{
                                        borderColor: '#e8d9d9ff',
                                    }} />
                                </Grid>
                            </>
                        ))}
                    </Grid>
                </Box>
                <Box sx={{
                    width: "50%",
                    overflow: "hidden",
                    borderRadius: "20px",
                    height: { lg: "400px", xs: "200px" }
                }}>
                    <img src={image}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                        }} />
                </Box>
            </Stack>
            <Typography
                sx={{
                    fontSize: { xs: "0.8rem", lg: "20px" },
                    fontWeight: "600",
                    color: "#4f4a4aff"
                }}>
                Made In Vietnam
            </Typography>

        </Box>
    )
}
