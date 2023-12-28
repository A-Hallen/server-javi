import Header from "./Header";
import "./style.css";
import "./particle-animation.css";
import Button from "@mui/material/Button";
import ServiceCard from "./ServiceCard";
import PriceCard from "./PriceCard";
import hlgIcon from "./img/hlgIcon.jpg";
import { createRef } from "react";
import ventasIcon from "./img/ventas.jpg";
import updateIcon from "./img/update.jpg";
import newsIcon from "./img/news.jpg";
import ScrollTop from "./scroll-top.tsx";
import { Container, Fab, Grid } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ParticleAnimationDiv from "./ParticleAnimationDiv";
import SplashScreen from "./SplashScreen";
import NetWorkInfo from "./NetWorkInfo.jsx";

let cardContainerServicesRef = createRef();
let page1Ref = createRef();

const fabTheme = createTheme({
  palette: {
    primary: {
      main: "#0000004f",
    },
  },
});

function handleScroll() {
  const element = cardContainerServicesRef.current;
  if (!element) {
    return;
  }
  const elementOffset = element.offsetTop;
  const scrollPosition = window.pageYOffset;
  const viewportHeight = window.innerHeight;
  const elementPosition = elementOffset - scrollPosition;
  if (elementPosition <= viewportHeight * 0.5) {
    element.classList.add("fade-in");
    window.removeEventListener("scroll", handleScroll);
  }
}

function getStartedClick() {
  page1Ref.current.scrollIntoView({ behavior: "smooth" });
}

export default function Home() {
  window.addEventListener("scroll", handleScroll);

  return (
    <div className="container">
      <SplashScreen />
      <div className="imageBg">
        <div className="shadow">
          <ParticleAnimationDiv />
          <Header />
        </div>
        <div className="getStarted">
          <h1>Servicios WiFi</h1>
          <p className="details">
            Ofrecemos un servicio de wifi excepcional con atención
            personalizada, velocidad de conexión confiable y soporte técnico
            siempre disponible.
          </p>
          <Button variant="contained" onClick={getStartedClick}>
            Iniciar
          </Button>
        </div>
      </div>
      <div className="page1" id="page1" ref={page1Ref}>
        <h2>Servicios</h2>
        <div
          className="cardContainerServices hide-for-fade-in"
          id="cardContainerServices"
          ref={cardContainerServicesRef}
        >
          <ServiceCard
            title={"HLG"}
            icon={hlgIcon}
            link={"https://portal.hlg.cu/"}
            details={
              "La red WIFI_HLG le dará el entretenimiento que tanto busca y la oportunidad de conocer nuevas personas a través de nuestros chats y plataformas sociales."
            }
          ></ServiceCard>
          <ServiceCard
            title={"Ventas"}
            icon={ventasIcon}
            link={"https://ventas.hlg.cu/"}
            details={
              "Ventas HLG es una página de compra y venta en línea de la ciudad de Holguín. Los usuarios pueden encontrar una amplia variedad de productos de diferentes categorías."
            }
          ></ServiceCard>
          <ServiceCard
            title={"Actualizaciones"}
            link={"/actualizaciones"}
            icon={updateIcon}
            details={
              "NOD32 es una excelente opción para aquellos que buscan un antivirus confiable y efectivo para proteger su equipo contra las amenazas en línea más avanzadas."
            }
          ></ServiceCard>
          <ServiceCard
            title={"Noticias"}
            icon={newsIcon}
            link={"/Noticias"}
            details={
              "Ofrecemos las últimas noticias, reportajes y análisis de diferentes temas de actualidad. Puedes encontrar información sobre política, economía, deportes, espectáculos y mucho más."
            }
          ></ServiceCard>
        </div>
      </div>
      <NetWorkInfo />
      <div className="page2">
        <h2>Precios</h2>
        <p className="details">
          Elija los precios que más se adecúen a sus necesidades, tenga en
          cuenta que el pago de la red se realiza cada mes entre los días 1 y 5.
          si desea adquirir además acceso a la Red <strong>Joven Club</strong>{" "}
          deberá pagar 250 pesos más.
        </p>
        <Container maxWidth="md" component="main">
          <Grid container spacing={5} alignItems="flex-end">
            <PriceCard
              title={"Gamer"}
              price={1500}
              description={[
                "Internet 24 Horas",
                "128Kb/s de subida",
                "512Kb/s de carga",
                "Baja latencia",
              ]}
              actionText={"Conjunto"}
            />
            <PriceCard
              title={"Login conjunto"}
              subheader={"Más popular"}
              price={"1000"}
              description={[
                "Internet 24 Horas",
                "128Kb/s de subida",
                "512 Kb/s de carga",
                "Latencia normal",
              ]}
              actionText={"Conjunto"}
            />
            <PriceCard
              title={"Login individual"}
              subheader={""}
              price={"5000"}
              description={[
                "Internet 24 Horas",
                "128Kb/s de subida",
                "2 Mb/s de carga",
                "Latencia normal",
              ]}
              actionText={"Individual"}
            />
          </Grid>
        </Container>
      </div>
      <div className="reglas">
        <h3>Reglas</h3>
        <p className="details">
          La red es de todos y para todos, es sin ánimo de lucro, gratuita. Sin
          embargo, hacer funcionar la misma así como mantenerla, implica gastos
          económicos los cuales no pueden recaer sobre unas pocas personas, por
          ese motivo mensual se recoge un aporte destinado a garantizar que de
          surgir un imprevisto tal como una rotura de un equipo (que no son
          baratos), y haya que arreglarlo o remplazarlo por uno nuevo, dicho
          imprevisto pueda ser solucionado, Además, existen los gastos de
          corriente razón de tener todo encendido 24/7 así como otros por
          disímiles razones.
        </p>
        <div className="footer">
          <h4>Info</h4>
          <div>
            <div>
              <p>Nombre</p>
              <p>: Javier Calzadilla Gonzales.</p>
            </div>
            <div>
              <p>Teléfono</p>
              <p>: 52396782</p>
            </div>
          </div>
        </div>
      </div>
      <ScrollTop>
        <ThemeProvider theme={fabTheme}>
          <Fab aria-label="scroll back to top" color="primary">
            <KeyboardArrowUpIcon />
          </Fab>
        </ThemeProvider>
      </ScrollTop>
    </div>
  );
}
