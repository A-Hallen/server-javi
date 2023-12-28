const fs = require("fs");
const http = require("http");
const https = require("https");
const cheerio = require("cheerio");
const path = require("path");

function obtenerTextoDeArchivo(path) {
  if (!fs.existsSync(path)) {
    console.log(`Error, el archivo: ${path} no existe`);
    return null;
  }
  try {
    const contenido = fs.readFileSync(path, "utf8");
    return contenido;
  } catch (error) {
    console.error("Error al leer el archivo:", error);
    return null;
  }
}

function getPagination(noticiasFiles, todayFolderName) {
  let as = [];
  let noticias = noticiasFiles.reverse();
  for (let i = 0; i < noticias.length; i++) {
    let name = path.basename(noticias[i]);
    let className =
      todayFolderName == name ? "pagination-link active" : "pagination-link";

    if (todayFolderName == null && i == 0) {
      className = "pagination-link active";
    }
    let a = `<a href="/Noticias/page/${name}" class="${className}">${
      i + 1
    }</a>`;
    as.push(a);
  }
  return as;
}

function formatearFecha(fecha) {
  let dateFormated = new Date(parseInt(fecha, 10)).toLocaleDateString("es-us", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  let date = dateFormated;

  try {
    date = dateFormated.charAt(0).toLocaleUpperCase() + dateFormated.slice(1);
  } catch (error) {
    console.log(`A ocurrido un error al formatear la fecha: ${date}`);
  }
  return date;
}

function getNoticiaFromJsonFile(jsonFile) {
  let jsonData = obtenerTextoDeArchivo(jsonFile);
  let json = JSON.parse(jsonData);
  let date = formatearFecha(json.time);
  let url = path.dirname(json.imgUrl);
  let mediaClass = json.bigImage ? "media-big" : "media";
  return `<div class="noticia">
          <h3 class="cat_title">${json.cat_title}</h3>
          <a class="title" href="${url}">${json.title}</a>
          <time datetime="${json.time}">${date}</time>
          <div class="spoiler">
            <a href="" class="${mediaClass}">
              <img
                src="${json.imgUrl}"
              />
            </a>
            <p>
            ${json.content}
            </p>
          </div>`;
}

function obtenerRutasArchivos(directorio) {
  const rutasArchivos = [];
  const archivos = fs.readdirSync(directorio);
  archivos.forEach((archivo) => {
    const rutaCompleta = path.join(directorio, archivo);
    rutasArchivos.push(rutaCompleta);
  });
  return rutasArchivos;
}

function eliminarArchivo(rutaArchivo) {
  try {
    fs.unlinkSync(rutaArchivo);
    console.log("El archivo se ha eliminado correctamente: " + rutaArchivo);
  } catch (error) {
    console.error("Error al eliminar el archivo: " + rutaArchivo, error);
  }
}

function saveJSON(carpetaDestino, nombreArchivo, jsonData) {
  let ruta = path.join(carpetaDestino, nombreArchivo);
  if (fs.existsSync(ruta)) {
    eliminarArchivo(ruta);
  }

  try {
    fs.writeFileSync(ruta, jsonData);
    console.log(`${nombreArchivo} guardado con exito en: ${ruta}`);
  } catch (error) {
    console.log("Error al guardar el archivo: " + ruta);
    console.log(error);
  }
}

const crearCarpetaSiNoExiste = (ruta) => {
  if (!fs.existsSync(ruta)) {
    fs.mkdirSync(ruta);
  }
};

const descargarArchivo = (url, carpetaDestino, nombreArchivo) => {
  const rutaDestino = path.join(carpetaDestino, nombreArchivo);
  if (fs.existsSync(rutaDestino)) {
    eliminarArchivo(rutaDestino);
  }
  const protocolo = url.startsWith("https") ? https : http;

  protocolo.get(url, (respuesta) => {
    respuesta.pipe(fs.createWriteStream(rutaDestino));
    console.log(`Archivo descargado y guardado en "${rutaDestino}"`);
  });
};

function getNews(todayFolderName = null) {
  var cubadebateText = obtenerTextoDeArchivo("./cubadebate.html");
  const cubadebatePage = cheerio.load(cubadebateText);

  let noticiasFiles = obtenerRutasArchivos(path.join(__dirname, "./noticias"));
  noticiasFiles.sort();
  if (noticiasFiles.length < 1) {
    return;
  }

  todayPath =
    todayFolderName == null
      ? noticiasFiles[noticiasFiles.length - 1]
      : path.join(__dirname, "./noticias", todayFolderName);

  let noticiasFolders = obtenerRutasArchivos(todayPath);
  if (noticiasFolders.length < 1) {
    return;
  }

  let noticiasPagination = getPagination(noticiasFiles, todayFolderName);
  cubadebatePage("#pagination").append(noticiasPagination);

  noticiasFolders.forEach((folder) => {
    let jsonFile = path.join(folder, "data.json");
    if (!fs.existsSync(jsonFile)) {
      return;
    }
    try {
      let noticia = getNoticiaFromJsonFile(jsonFile);
      cubadebatePage("#content-root").append(noticia);
    } catch (error) {
      console.log(`Error al obtener la noticia: ${error.message}`);
    }
  });

  return cubadebatePage.html();
}

exports.formatearFecha = formatearFecha;
exports.getNews = getNews;
exports.descargarArchivo = descargarArchivo;
exports.crearCarpetaSiNoExiste = crearCarpetaSiNoExiste;
exports.saveJSON = saveJSON;
exports.eliminarArchivo = eliminarArchivo;
exports.obtenerRutasArchivos = obtenerRutasArchivos;
exports.getNoticiaFromJsonFile = getNoticiaFromJsonFile;
exports.obtenerTextoDeArchivo = obtenerTextoDeArchivo;
