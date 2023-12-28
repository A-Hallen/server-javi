import { CardActionArea, CardContent, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import LoadingComponent from "./LoadingComponent";

const VariableInfo = ({ title, content, color = "white" }) => {
  if (!content || content === "undefined") {
    return;
  }
  return (
    <tr>
      <td>
        <Typography variant="body1" color={"white"} marginRight={"10px"}>
          {title}
        </Typography>
      </td>
      <td>
        <Typography variant="body2" color={color} marginRight={"10px"}>
          {content}
        </Typography>
      </td>
    </tr>
  );
};

const ColoredVariableInfo = ({
  title,
  number,
  min,
  normal,
  reverse = false,
  suffix = "",
}) => {
  let color = "yellow";
  let calcNumber = number;
  if (reverse) {
    calcNumber = min + normal - number;
  }

  if (calcNumber < min) {
    color = "red";
  } else if (calcNumber > normal) {
    color = "green";
  }

  return (
    <VariableInfo title={title} content={number + " " + suffix} color={color} />
  );
};

function getData() {
  return new Promise((resolve, reject) => {
    fetch("/connectionInfo")
      .then((response) => {
        if (response.ok) {
          console.log(response);
          return response.json();
        } else {
          response.text().then((text) => {
            console.log(text);
          });
          throw new Error("Error en la respuesta del servidor.");
        }
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function modifiData(setData, setIsLoading) {
  getData()
    .then((data) => {
      setData(data);
      setIsLoading(1);
    })
    .catch((error) => {
      console.error(error);
      setIsLoading(2);
    });
}

const NetWorkInfo = () => {
  const [_data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(0);

  useEffect(() => {
    modifiData(setData, setIsLoading);
  }, []);

  if (isLoading === 2) {
    return;
  }

  return (
    <div style={{ padding: "20px" }}>
      <div className="connection-details">
        {isLoading === 0 ? (
          <LoadingComponent />
        ) : (
          <MainComponent
            data={_data}
            onClick={() => {
              modifiData(setData, setIsLoading);
            }}
          />
        )}
      </div>
    </div>
  );
};

function convertirTiempo(segundos) {
  const dias = Math.floor(segundos / (60 * 60 * 24));
  segundos %= 60 * 60 * 24;

  const horas = Math.floor(segundos / (60 * 60));
  segundos %= 60 * 60;

  const minutos = Math.floor(segundos / 60);
  segundos %= 60;

  let resultado = "";

  if (dias > 0) {
    resultado += dias + ":";
  }

  resultado += horas.toString().padStart(2, "0") + ":";
  resultado += minutos.toString().padStart(2, "0") + ":";
  resultado += segundos.toString().padStart(2, "0");

  return resultado;
}

const MainComponent = ({ data, onClick }) => {
  return (
    <CardActionArea style={{ color: "white" }} onClick={onClick}>
      <CardContent style={{ width: "100%", boxSizing: "border-box" }}>
        <Typography
          variant="h5"
          color={"white"}
          style={{ margin: "auto", marginBottom: "20px" }}
          className="connection-details-title"
        >
          Detalles de la conexión
        </Typography>
        <table className="connection-details-table">
          <tbody>
            <VariableInfo title="MAC:" content={data.mac} />
            <VariableInfo title="Transmisión:" content={data.tx + " Mbps"} />
            <VariableInfo title="Recepción:" content={data.rx + " Mbps"} />
            <VariableInfo title="Señal Rx, dBm:" content={data.signal} />
            <VariableInfo title="RSSI:" content={data.rssi} />
            <ColoredVariableInfo
              title="CCQ"
              number={data.ccq}
              min={80}
              normal={95}
            />
            <ColoredVariableInfo
              title="Latencia:"
              number={data.tx_latency}
              min={30}
              normal={100}
              reverse={true}
              suffix="ms"
            />
            <VariableInfo
              title="Tiempo de actividad:"
              content={convertirTiempo(data.uptime)}
            />
            <VariableInfo title="ACK:" content={data.ack} />
            <VariableInfo title="Distancia:" content={data.distance + " m"} />
            <ColoredVariableInfo
              title="Potencia de transmisión:"
              number={data.txpower}
              min={15}
              normal={20}
            />
            <VariableInfo title="Ruido de fondo:" content={data.noisefloor} />
          </tbody>
        </table>
      </CardContent>
    </CardActionArea>
  );
};

export default NetWorkInfo;
