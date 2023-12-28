import * as React from "react";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Box, Card, CardHeader, Grid, withStyles } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import { styled } from "@mui/system";

// Estilos personalizados para la tarjeta
const TransparentCard = styled(Card)`
  background: #3b3a3a30;
  color: white;
`;

const SilverHeader = styled(CardHeader)(({ theme }) => ({
  background: `linear-gradient(    52deg,    #fff 3%,    #a7a6a6 30%,    #fff 50%,    #a7a6a6 70%,    #fff 93%,    #999 110%  )`,
  userSelect: "none",
  color: "#2e2d2d",
  textShadow: "1px 1px 2px white;",
}));

const GoldenHeader = styled(CardHeader)(({ theme }) => ({
  background: `linear-gradient(45deg,#d4af37 5%,#debc5b 10%,#f5f0b6 30%,#e9e1b7 50%,#e7c97c 70%,#debc5b 80%,#d9b433 95%)`,
  color: "#2e2d2d",
  userSelect: "none",
  textShadow: "1px 1px 2px white;",
}));

const GradientTypography = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(45deg, #0652b1, #02fdba)`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  userSelect: "none",
}));

export default function ServiceCard({
  title,
  subheader,
  price,
  description,
  actionText,
}) {
  return (
    <Grid
      item
      key={title}
      xs={12}
      sm={title === "Login individual" ? 12 : 6}
      md={4}
    >
      <TransparentCard>
        {title === "Login individual" ? (
          <GoldenHeader
            title={title}
            subheader={subheader}
            titleTypographyProps={{ align: "center", fontWeight: "bold" }}
            action={title === "Login conjunto" ? <StarIcon /> : null}
            subheaderTypographyProps={{
              align: "center",
              color: "#6d6d6d",
              textShadow: "1px 1px 2px white;",
            }}
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? "#bfbfbf17"
                  : theme.palette.grey[700],
            }}
          />
        ) : (
          <SilverHeader
            title={title}
            subheader={subheader}
            titleTypographyProps={{ align: "center", fontWeight: "bold" }}
            action={title === "Login conjunto" ? <StarIcon /> : null}
            subheaderTypographyProps={{
              align: "center",
              color: "#6d6d6d",
              textShadow: "1px 1px 2px white;",
            }}
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? "#bfbfbf17"
                  : theme.palette.grey[700],
            }}
          />
        )}

        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
              mb: 2,
            }}
          >
            <GradientTypography component="h2" variant="h3">
              ${price}
            </GradientTypography>
            <Typography variant="h6" color="#d5d5d599">
              /men
            </Typography>
          </Box>
          <ul className="price-ul">
            {description.map((line) => (
              <Typography
                component="li"
                variant="subtitle1"
                align="center"
                key={line}
              >
                {line}
              </Typography>
            ))}
          </ul>
        </CardContent>
        <CardActions>
          <Button fullWidth variant={"outlined"}>
            {actionText}
          </Button>
        </CardActions>
      </TransparentCard>
    </Grid>
  );
}
