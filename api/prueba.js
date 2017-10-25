

var crypto = require('crypto');
var shasum = crypto.createHash('sha1');

var idCliente = "108";
var aplicacion = "Extracurriculares";

var factor = ((idCliente / 2) + idCliente) * 3;

var token = crypto.createHash('sha1').update(factor + crypto.createHash('sha1').update(idCliente + aplicacion).digest("hex")).digest("hex");

var hoy = new Date();
var dd = hoy.getDate();
var mm = hoy.getMonth()+1;
var yyyy = hoy.getFullYear();
var fecha = yyyy + "-" + mm + "-" + dd;
var llave = "5e16effa-a812-489a-9e5f-07b6f7a1813a";
var shasumSha1 = crypto.createHash('sha1');
var shasumMd5 = crypto.createHash('md5');

var token = shasumSha1.update(llave + shasumMd5.update(fecha).digest("hex")).digest("hex");

console.log(fecha);
console.log(token);
var json_verifica_webpay2 = "{\"autenticacion\":{\"aplicacion\":\"" + aplicacion + "\",";
json_verifica_webpay2 += "\"sesion\":\"" + token + "\",";
json_verifica_webpay2 += "\"fecha\":\"" + fecha + "\"},";
json_verifica_webpay2 += "\"consulta\":{\"id_cliente\":" + idCliente + "}}";

console.log(json_verifica_webpay2);

