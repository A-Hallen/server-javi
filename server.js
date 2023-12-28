const path = require("path");
const express = require("express");
const fs = require("fs").promises;
const connectionInfo = require("./connection_info");

const app = express();
const PORT = process.env.PORT || 3000;

const updatesPath = path.join(__dirname, "updates");
const buildPath = path.join(__dirname, "client", "build");

const serve_cubadebate = require("./serve_cubadebate");
const e = require("express");

// Servir la aplicación de React
app.use(express.static(buildPath));

async function getUpdates() {
  const folders = await fs.readdir(updatesPath);
  const data = await Promise.all(
    folders.map(async (folder) => {
      const folderPath = path.join(updatesPath, folder);
      const detailsPath = path.join(folderPath, folder + ".txt");
      const iconPath = path.join(folderPath, `${folder}.png`);
      const jpgPath = path.join(folderPath, `${folder}.jpg`);
      const address = path.join(folder, `${folder}.zip`);

      const [details, icon] = await Promise.all([
        fs.readFile(detailsPath, "utf-8").catch(() => ""),
        fs
          .access(iconPath, fs.constants.F_OK)
          .then(() => path.join("actualizaciones", folder, `${folder}.png`))
          .catch(() =>
            fs
              .access(jpgPath, fs.constants.F_OK)
              .then(() => path.join("actualizaciones", folder, `${folder}.jpg`))
              .catch(() => "")
          ),
      ]);

      return {
        name: folder,
        details,
        address,
        icon,
      };
    })
  );

  return data;
}

app.get("/connectionInfo", async (req, res) => {
  const netInfo = new connectionInfo.NetInfo(
    "192.168.13.9",
    "ubnt",
    "Josetec8507"
  );

  if (!req.ip) {
    res.status(400);
    return;
  }
  let ip = req.ip.split(":").slice(-1)[0];

  try {
    console.log(`ipAdress: ${ip}`);
    if (ip == 1 || ip == "192.168.13.20") {
      throw Error("Same server error");
    }
    let data = await netInfo.getNetworkInfoFromIp(ip);
    if (!data) {
      netInfo.setUrls("192.168.13.4");
      data = await netInfo.getNetworkInfo(ip);
    }
    res.json(data);
  } catch (error) {
    console.log(error.message);
    res.status(400);
    res.send(`ip: ${ip}`);
  }
  return;
});

// Obtener las actualizaciones
app.get("/updates", async (req, res) => {
  const data = await getUpdates();
  res.json(data);
});

// Redirigir todas las solicitudes de actualizaciones a la aplicación de React
app.get("/actualizaciones/:file(*)", (req, res) => {
  const file = req.params.file;
  const fileLocation = path.join(updatesPath, file);
  res.sendFile(fileLocation);
});

serve_cubadebate.listen(app);

// Redirigir todas las solicitudes a la aplicación de React
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// Escuchar en el puerto especificado o en el puerto 3000 por defecto
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
