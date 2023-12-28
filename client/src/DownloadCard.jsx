import {
  CardContent,
  Typography,
  CardMedia,
  CardActionArea,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

// Componente "DownloadCard"
export default function DownloadCard({
  name = "",
  details = "",
  address = "",
  icon,
}) {
  return (
    <div className="DownloadCard">
      {/* Área de acción del Card */}
      <CardActionArea
        href={address}
        download={name}
        // Estilos en línea
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        {/* Contenido del Card */}
        <CardMedia
          component="img"
          // Estilos en línea
          style={{ width: 80, height: 80, margin: 0 }}
          image={icon}
        ></CardMedia>
        <CardContent style={{ width: "100%" }}>
          <Typography variant="h5" component="div">
            {name}
          </Typography>
          <Typography
            variant="body2"
            className="detailsDownload"
            style={{
              lineHeight: "1.2em" /* altura de línea */,
            }}
          >
            {details}
          </Typography>
        </CardContent>
        {/* Icono de descarga */}
        <DownloadIcon style={{ width: 40, height: 40, marginRight: 10 }} />
      </CardActionArea>
    </div>
  );
}
