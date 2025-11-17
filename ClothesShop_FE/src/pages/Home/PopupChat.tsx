import { Box } from "@mui/material";

export default function PopupChat({ setChatOpen, setPopupOpen }:
    {
        setChatOpen: (open: boolean) => void,
        setPopupOpen: (open: boolean) => void
    }) {
    return (
        <Box
            onClick={() => { setChatOpen(true); setPopupOpen(false) }}
            sx={{
                backgroundColor: "white",
                position: "fixed",
                bottom: 50,
                right: 30,
                borderRadius: "50%",
                width: "50px",
                aspectRatio: "1/1",
                zIndex: 1000,
                boxShadow: "rgba(0, 0, 0, 0.1) 11px 11px 11px 10px",
                cursor: "pointer",
                overflow: "hidden",
                transition: "transform 0.3s ease",
                "&:hover": {
                    transform: "scale(1.1)",
                },
            }}>
            <img
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }}
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX0mKrzeX319CWVO-zz3O2uf9D7zdWMd_s5A&s" alt="" />
        </Box>
    )
}
