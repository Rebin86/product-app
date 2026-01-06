import * as React from "react";
import { AppBar, Toolbar, Typography, Container, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="sticky" elevation={0} color="default">
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/products"
            sx={{ textDecoration: "none", color: "inherit", fontWeight: 700 }}
          >
            Product Explorer
          </Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3 }}>{children}</Container>
    </Box>
  );
}
