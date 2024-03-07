import { Container } from "react-bootstrap";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

const NotAccessible = () => {
  return (
    <Container fluid className="page-container page-not-found">
      <Stack sx={{ width: "100%", marginTop: "20px" }} spacing={2}>
        <Alert severity="error">
          <strong>Sorry, You don't have permission to access this page.</strong>
        </Alert>
      </Stack>
    </Container>
  );
};

export default NotAccessible;
