import { Button } from "@mui/material";
import icon from "./img/wifi.png";
import { styled } from "@mui/material/styles";

function Header() {
  let estilo = {
    textTransform: "capitalize",
    color: "#008587",
  };
  const ColorButton = styled(Button)(() => ({
    "&:hover": {
      backgroundColor: "#ffffff1f",
    },
  }));
  return (
    <header className="header">
      <div className="logo">
        <img
          alt="Logo"
          src={icon}
          style={{ margin: "auto", height: "35px", width: "35px" }}
        />
        <p style={{ marginLeft: "10px" }}>Red Javi</p>
      </div>
      <nav className="nav">
        <ul>
          <li>
            <ColorButton
              style={estilo}
              target="_blank"
              href="http://2.2.2.2/webfig/"
            >
              Reinicio
            </ColorButton>
          </li>
          <li>
            <ColorButton
              style={estilo}
              target="_blank"
              href="http://10.28.41.10/"
            >
              Harlem Test
            </ColorButton>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
