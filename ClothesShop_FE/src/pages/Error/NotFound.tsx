import { Box, Container, Typography } from "@mui/material";
import image from "../../assets/404.png";
export default function NotFound() {
    return (
        <Box>

            <Container sx={{ width: "40%", }}>
                <img src={image} style={{
                    width: "100%",
                    height: "100%",
                }} />
            </Container>
            <Typography variant="h3" align="center" sx={{ fontWeight: 700 }}>
                Page Not Found
            </Typography>


        </Box>
    )
}
