import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { Box } from "@mui/material";

function MainLayout() {
  return (
    <>
      <Navbar />
      <Box>
        <Outlet />
      </Box>
    </>
  );
}

export default MainLayout;