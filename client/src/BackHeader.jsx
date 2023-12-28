import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useCallback } from "react";

const ColorButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.getContrastText("#000"),
  "&:hover": {
    backgroundColor: "#ffffff1f",
  },
}));

const BackHeader = () => {
  const onClick = useCallback((e) => {
    window.open("/", "_self");
  }, []);

  return (
    <div className="header">
      <div className="logo">
        <ColorButton onClick={onClick}>
          <ArrowBackIcon
            htmlColor="white"
            alt="Home"
            style={{ margin: "auto", height: "35px", width: "35px" }}
          />
        </ColorButton>
      </div>
      <h3
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          marginRight: "50px",
        }}
      >
        Actualizaciones
      </h3>
    </div>
  );
};

export default BackHeader;
