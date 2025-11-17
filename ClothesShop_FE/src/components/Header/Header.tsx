/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, IconButton, InputAdornment, Stack, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import logo from "../../assets/logo1.png";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import { NavLink, useNavigate } from "react-router-dom";
import Cart from "./Cart";
import { useState } from "react";
import AuthModal from "../AuthModal/AuthModal";
import MobileHeader from "./MobileHeader";
import { useSelector } from "react-redux";
import ProfileModal from "./ProfileModal";
import ForgotPasswordModal from "../AuthModal/ForgotPasswordModal";
import type { HeaderProps } from "../../types/types";
import { useQuery } from "@tanstack/react-query";
import { getCartQuantityApi } from "../../services/cartService";
const navItems = [
  { name: "Home", path: "/" },
  { name: "Nam", path: "/category/nam" },
  { name: "Nữ", path: "/category/nu" },
]
export default function Header({ headerRef }: HeaderProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const isLogin = useSelector((state: any) => state.auth.login);
  const [openAuthModal, setOpenAuthModal] = useState<boolean>(false);
  const [openProfileModal, setOpenProfileModal] = useState<boolean>(false);
  const [openForgotPasswordModal, setOpenForgotPasswordModal] = useState<boolean>(false);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const theme = useTheme();
  const isMobile: boolean = useMediaQuery(theme.breakpoints.down("sm"));
  const handleProfileClick = () => {
    if (isLogin) {
      setOpenProfileModal(true);
    } else {
      setOpenAuthModal(true);
    }
  }
  const guestToken = isLogin == true ? null : localStorage.getItem("guestToken");
  const { data: cartQuantity } = useQuery({
    queryKey: ["cartQuantity", guestToken],
    queryFn: () => getCartQuantityApi(guestToken),
    staleTime: 1000 * 10 * 60, // 10 minutes
    enabled: !!guestToken || !!isLogin,
  });

  return (
    <Stack ref={headerRef}
      direction={"row"} sx={{
        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
        backgroundColor: "secondary.main",
        alignItems: "center",
        justifyContent: "space-between",
        px: { lg: 5, xs: 1 },
        position: "fixed",
        top: 0,
        zIndex: 1000,
        width: "100%",
      }}>
      {/* logo */}
      <Box sx={{
        height: "5rem",
        overflow: "hidden",
        cursor: "pointer",
      }}
        onClick={() => navigate("/")}>
        <img src={logo} alt="logo"
          style={{
            height: "130%",
            width: "130%",
            objectFit: "cover",
            marginTop: "-0.5em"
          }} />
      </Box>
      {/* menu */}
      {isMobile ?
        <MobileHeader
          openDrawer={openDrawer}
          setOpenDrawer={setOpenDrawer}
          navItems={navItems}
          navigate={navigate} /> :
        (
          <Stack direction={"row"} sx={{
            width: "45%",
            justifyContent: "space-evenly",
            alignItems: "center"
          }}>
            {navItems.map((item, index) => (
              <NavLink to={item.path} key={index}
                style={{
                  textDecoration: "none",
                }}>
                <Typography sx={{ fontWeight: 600 }}>
                  {item.name}
                </Typography>
              </NavLink>
            ))}
          </Stack>
        )}

      <Stack direction={"row"} sx={{ alignItems: "center", gap: { xs: 0, lg: 2 } }}>
        <TextField variant="outlined" label="Tìm kiếm"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const keyword = searchTerm.trim();
              if (keyword) {
                navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
              }
            }
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "40px",
            },
            "& .MuiInputLabel-root": {
              color: "gray",
            },
          }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }} />
        {/* profile icon */}
        <IconButton onClick={handleProfileClick}>
          <AccountCircleIcon sx={{ color: isLogin ? "green" : "black" }} />
        </IconButton>
        {/* cart icon */}
        <Cart onClick={() => navigate("/cart")}
          quantity={cartQuantity?.quantity} />
      </Stack>
      <AuthModal open={openAuthModal}
        handleClose={() => setOpenAuthModal(false)}
        setOpenForgotPasswordModal={setOpenForgotPasswordModal} />
      <ProfileModal open={openProfileModal} handleClose={() => setOpenProfileModal(false)} />
      <ForgotPasswordModal open={openForgotPasswordModal}
        handleClose={() => setOpenForgotPasswordModal(false)} />
    </Stack>
  )
}
