const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");
const noticias_functions = require("./noticias_functions");

var todayNewsPath = "";

async function listen(app) {
  app.get("/Noticias", (req, res) => {
    serve(app);
    let home = noticias_functions.getNews();
    res.send(home);
  });

  app.get("/Noticias/:date(*)/:number(*)/image.jpg", (req, res) => {
    let date = req.params.date;
    let number = req.params.number;
    res.sendFile(
      path.join(__dirname, "./noticias/", date, number, "image.jpg")
    );
  });

  app.get("/Noticias/src/:file(*)", (req, res) => {
    let file = req.params.file;
    res.sendFile(path.join(__dirname, "src", file));
  });

  app.get("/Noticias/page/:folder(*)", (req, res) => {
    let noticiasFolder = req.params.folder;
    let home = noticias_functions.getNews(noticiasFolder);
    res.send(home);
  });

  app.get("/Noticias/:date(*)/:number(*)", (req, res) => {
    let date = req.params.date;
    let number = req.params.number;
    serveNoticia(date, number, (html) => {
      res.send(html);
    });
  });
}

async function serveNoticia(date, number, then) {
  let noticiasFolder = path.join(__dirname, "/noticias");
  let thisDayFolder = path.join(noticiasFolder, date);
  let thisNoticiaFolder = path.join(thisDayFolder, number);
  let jsonFile = path.join(thisNoticiaFolder, "data.json");
  let jsonData = noticias_functions.obtenerTextoDeArchivo(jsonFile);
  let json = JSON.parse(jsonData);
  let datetime = noticias_functions.formatearFecha(json.time);
  let mediaClass = json.bigImage ? "media-big" : "media";
  let content = await getNoticiaContent(json.link, mediaClass);

  if (content != null) {
    noticias_functions.saveJSON(thisNoticiaFolder, "content.txt", content);
    console.log("El contenido no es nulo");
  } else {
    let contentPath = path.join(thisNoticiaFolder, "content.txt");
    content = noticias_functions.obtenerTextoDeArchivo(contentPath);
  }
  if (content == null) {
    content = json.content;
  }

  let noticia = `<div class="noticia">
  <h3 class="cat_title">${json.cat_title}</h3>
  <a class="title" href="">${json.title}</a>
  <time datetime="${json.time}">${datetime}</time>
  <div class="spoiler">
    <a href="" class="${mediaClass}">
      <img class="noticia-img" src="${json.imgUrl}"
      />
    </a>
    <p>
    ${content}
    </p>
  </div>`;

  let cubadebate =
    noticias_functions.obtenerTextoDeArchivo("./src/noticia.html");
  let $ = cheerio.load(cubadebate);
  $("title").text = json.title;
  $(".spoiler").append(noticia);
  then($.html());
}

async function getNoticiaContent(url, mediaClass) {
  let response;
  try {
    response = await axios.get(url);
  } catch (error) {
    console.log(`Error de conexion al obtener los datos de: ${url}`);
    return null;
  }

  let tags = ["p", "a", "h1", "h2", "h3", "h4"];
  const html = response.data;
  const $ = cheerio.load(html);
  let note_content = $(".note_content");

  note_content.children().each((index, element) => {
    if (!element.tagName in tags) {
      $(element).remove();
    } else {
      if (element.tagName == "div") {
        let div = $(element);
        div.removeAttr("style");
      }
    }
  });
  try {
    note_content.find("#moreposts").remove();
    note_content.find(".share-link").remove();
  } catch (error) {}
  note_content.find(".wp-caption").each((index, element) => {
    if (index == 0) {
      if (mediaClass == "media") {
        $(element).remove();
      }
    } else {
      $(element).remove();
    }
  });
  note_content.find("[href]").removeAttr("href");
  note_content.find("[src]").removeAttr("src");
  note_content.find("img").remove();

  return note_content.html();
}

async function serve(app) {
  let cubadebateUrl = "http://www.cubadebate.cu/categoria/noticias/";
  let response;

  try {
    response = await axios.get(cubadebateUrl);
  } catch (error) {
    console.log("Error de conexion al obtener los datos de cubadebate");
    return;
  }
  const html = response.data;
  const $ = cheerio.load(html);

  $(".noticias").each((index, element) => {
    const data = {
      cat_title: "",
      title: "",
      time: "",
      link: "",
      imgUrl: "",
      imgPath: "",
      content: "",
      bigImage: false,
    };

    const catTitleArray = $(element)
      .find("h3 a")
      .map((index, el) => $(el).text())
      .get();

    data.bigImage = $(element).hasClass("bigimage_post");

    data.cat_title = catTitleArray.join(", ") + " »";
    data.title = $(element).find(".title").text();

    const tiempo = $(element).find(".meta time").attr("datetime");
    const fecha = new Date(tiempo);
    fecha.setHours(0, 0, 0, 0);
    data.time = fecha.getTime().toString();

    const spoilerElement = $(element).find(".spoiler");
    data.content = spoilerElement.find(".excerpt").text();
    data.link = spoilerElement.find("a").attr("href");
    const imageUrl = spoilerElement.find("a img").attr("src");

    data.imgUrl = `/Noticias/${data.time}/${index}/image.jpg`;

    todayNewsPath = path.join(__dirname, "./noticias", data.time);
    noticias_functions.crearCarpetaSiNoExiste(todayNewsPath);
    let newPath = path.join(todayNewsPath, index.toString());
    data.imgPath = path.join(newPath, "image.jpg");
    noticias_functions.crearCarpetaSiNoExiste(newPath);
    noticias_functions.descargarArchivo(imageUrl, newPath, "image.jpg");
    const jsonData = JSON.stringify(data);
    noticias_functions.saveJSON(newPath, "data.json", jsonData);
  });
}

exports.listen = listen;
