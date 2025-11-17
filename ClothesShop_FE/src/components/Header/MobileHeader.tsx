import { Box, Drawer, IconButton, List, ListItem, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
interface HeaderProps{
    setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>;
    openDrawer: boolean;
    navigate: (path: string) => void;
    navItems: { name: string; path: string }[];
}
export default function MobileHeader({ setOpenDrawer, openDrawer, navigate, navItems }: HeaderProps) {
  return (
    <>
          <IconButton onClick={() => setOpenDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Drawer anchor="left" open={openDrawer} onClose={() => setOpenDrawer(false)}>
            <Box sx={{ width: 250 }}>
              <List>
                {navItems.map((item, index) => (
                  <ListItem
                    key={index}
                    component="div" // hoặc "button" hoặc "a"
                    onClick={() => {
                      navigate(item.path);
                      setOpenDrawer(false);
                    }}
                  >
                    <ListItemText primary={item.name} />
                  </ListItem>

                ))}
              </List>
            </Box>
          </Drawer>
        </>
  )
}
