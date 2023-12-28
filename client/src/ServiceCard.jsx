import Typography from "@mui/material/Typography";
import { CardActionArea, CardContent, CardMedia } from "@mui/material";

export default function ServiceCard({ title, details, icon, link }) {
  return (
    <div className="ServiceCard">
      <CardActionArea
        href={link}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          height: "100%",
          justifyContent: "space-between",
        }}
        style={{ color: "white" }}
      >
        <CardMedia
          sx={{ height: 140, width: "100%" }}
          image={icon}
          title={title}
        />
        <CardContent>
          <Typography variant="h5" color={"white"}>
            {title}
          </Typography>
          <Typography variant="body2" className="detailsText">
            {details}
          </Typography>
        </CardContent>
      </CardActionArea>
    </div>
  );
}
