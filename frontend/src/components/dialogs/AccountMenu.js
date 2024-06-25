import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
// import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
// import PersonAdd from "@mui/icons-material/PersonAdd";
// import Settings from "@mui/icons-material/Settings";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import { Link } from "react-router-dom";
import HolidayVillageRoundedIcon from "@mui/icons-material/HolidayVillageRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

export default function AccountMenu({ user, onSignIn, onSignOut }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{ width: 32, height: 32, color: "primary.dark", backgroundColor:"background.paper", cursor: "pointer",
                  transition: "0.3s ease",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.8)",
                  }, }}>M</Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Link
          to="/profile"
          style={{ textDecoration: "none", color: "rgba(20,19,19,0.87)" }}
        >
          <MenuItem>
            <Avatar sx={{ color: "primary.dark", bgcolor: "primary.light" }}>
              <PersonRoundedIcon />
            </Avatar>
            Mein Profil
          </MenuItem>
        </Link>
        <Link
          to="/household"
          style={{ textDecoration: "none", color: "rgba(20,19,19,0.87)" }}
        >
          <MenuItem onClick={handleClose}>
            <Avatar sx={{ color: "primary.dark", bgcolor: "primary.light" }}>
              <HolidayVillageRoundedIcon />
            </Avatar>
            Alle Haushalte
          </MenuItem>
        </Link>
        <Divider />
        <MenuItem onClick={user ? onSignOut : onSignIn}>
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" sx={{ color: "rgba(20,19,19,0.87)" }} />
          </ListItemIcon>
          {user ? "Logout" : "Login"}
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
