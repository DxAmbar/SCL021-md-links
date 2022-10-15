#!/usr/bin/env node

const fs = require("fs"); //importando módulo file system, se almacena en const con el mismo nombre. Interactúa con archivos del sistema
const path = require("path"); // rutas de archivos
const colors = require('colors'); //importando colores desde npm install colors
const { readFileSync } = require("node:fs");
const { argv } = require("node:process"); //retorna un array que contiene los argumentos de la línea de comandos pasados 
const parseMD = require("parse-md").default;
const fetch = require("node-fetch");
const { url } = require("inspector");

//console.log('soy un texto en color'.rainbow)

function mdlinks(ruta) {
  //console.log("hola", ruta);

  //comprabando si las rutas existen
  const routeExist = () => fs.existsSync(ruta);
  //console.log(routeExist());

  //comprobamos si es archivo
  const routeType = (source) => {
    if (source.isFile() === true) {
      return true;
    }
    return false;
  };
  //leer archivos de tu ruta principal
  const routeFiles = fs.statSync(ruta);
  //console.log("es archivo? " + routeType(routeFiles));
  //console.log(routeIsAFile);
  //HASTA AQUI OK

  //lee los archivos de la ruta relativa
  const dir = fs.readdirSync(ruta, { encoding: "utf8", flag: "r" }); //utf-8 se ocupa para convertir el dato obtenido en un string tipico
  //flag r abre el archivo para leerlo
  //console.log("estos son los archivos del directorios" + dir);
  //console.log(dir);

  //filtro de archivo md
  let array = [];
  function rute(dir) {
    return (array = dir.filter((archivo) => {
      return path.extname(archivo) === ".md";
      //console.log(array);
    }));
  }
  //leer archivos MD
  const arrayMd = rute(dir);
  function readMD(paths) {
    //console.log("ejecutando path");
    paths.forEach((element) => {
      const data = fs.readFileSync(element, { encoding: "utf8", flag: "r" });
      //console.log("leyendo", data);
    });
  }
  readMD(arrayMd);
  //console.log(rute(dir));

  //Existen los links ?
  const fileContents = fs.readFileSync("README.md", "utf8");
  const { metadata, content } = parseMD(fileContents);
  //console.log(metadata);
  //console.log(content);

  //se leen los links
  const Url =
    /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim;
  function FindLinks(content) {
    return content.match(Url);
  }
  const arrUrl = FindLinks(fileContents);

  const transformed = arrUrl.map((item) => {
    // return item.toUpperCase()
    //return fetch(item)
  });

  //console.log(transformed)
  //promesa y contador de links
  const counter = [];
  console.log(arrUrl);
  arrUrl.forEach((url) => {
    fetch(url)
      .then((respuestaExitosa) => {
        console.log({ url, estado: respuestaExitosa.status });
        if (respuestaExitosa.status === 200) {
          counter.push("pushing links");
          console.log("Links validos:", counter.length);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
  //console.log(counter.length);
}

mdlinks("./");

