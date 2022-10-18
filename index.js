#!/usr/bin/env node

const fs = require("fs"); //importando módulo file system, se almacena en const con el mismo nombre. Interactúa con archivos del sistema
const path = require("path"); // rutas de archivos
const colors = require('colors'); //importando colores desde npm install colors
const { readFileSync } = require("node:fs");
const { argv } = require("node:process"); //retorna un array que contiene los argumentos de la línea de comandos pasados 
const parseMD = require("parse-md").default; //retorna el contenido de arch. .md como un objeto con metadata y content keys. 
const fetch = require("node-fetch");
const { url } = require("inspector");

//console.log('soy un texto en color'.rainbow)

function mdlinks(ruta) {


  //comprabando si las rutas existen
  const routeExist = () => fs.existsSync(ruta);

  //comprobando si es archivo
  const routeType = (source) => {
    if (source.isFile() === true) {
      return true;
    }
    return false;
  };
  //leer archivos de la ruta principal
  const routeFiles = fs.statSync(ruta);


  //lee los archivos de la ruta relativa
  const dir = fs.readdirSync(ruta, { encoding: "utf8", flag: "r" }); //utf-8 se ocupa para convertir el dato obtenido en un string tipico
  //flag r abre el archivo para leerlo

  //filtro de archivos .md
  let array = [];
  function rute(dir) {
    return (array = dir.filter((archivo) => {
      return path.extname(archivo) === ".md";
    }));
  }
  //leer archivos .md
  const arrayMd = rute(dir);
  function readMD(paths) {
    paths.forEach((element) => {
      const data = fs.readFileSync(element, { encoding: "utf8", flag: "r" });
    });
  }
  readMD(arrayMd);

  //comprobando si los links existen
  const fileContents = fs.readFileSync("README.md", "utf8");
  const { metadata, content } = parseMD(fileContents);

  //se leen los links
  const Url = //expr. regular que verifica si el string tiene un formato de URL válido
    /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim;
  function FindLinks(content) {
    return content.match(Url);
  }
  const arrUrl = FindLinks(fileContents);

  const transformed = arrUrl.map((item) => {

  });

  //Contador de links
  //declaramos variables y arreglos
  const exitos = [];
  const errores = [];
  let validos;
  let broken;
  console.log(arrUrl);
  const arrfetch = arrUrl.map((url) => {
    return fetch(url)
  });
  Promise.allSettled(arrfetch) //devuelve obj. promesa que ya se cumplió como array vacío
    .then((result) => {
      result.forEach((res) => {
        if (res.status === "fulfilled") { //cambia el código de estado http con valor por defecto 200
          if (res.value.status === 200) { 
            console.log("Exito ", res.value?.status, res.value?.url); 
          } else { console.log("Error ", res.value?.status, res.value?.url); }
          exitos.push({ status: res.value?.status, url: res.value?.url });
        } else {
          console.log("Error", res.reason);
          errores.push({ error: res.reason })
        }
        validos = exitos.filter(url => url.status === 200) //links exitosos con valor 200
       
        broken = exitos.filter(url => url.status !== 200) //links rotos con valor distinto de 200
        
      });
    }).finally(() => {  //función de callback específica: cuando la promesa se resuelve; sea exitosa o rechazada
      console.log("-------------------------------------------")
      console.log("| Links válidos : ".rainbow, validos.length, " | ", "total errores: ".red, broken.length, " | ")
      console.log("-------------------------------------------".green)
      console.log("|         Detalle análisis                   |".green)
      console.log("-------------------------------------------".green)
      exitos.forEach((exito) => console.log(`status : ${exito.status}  url : ${exito.url}`.blue))
    });
}

mdlinks("./");

