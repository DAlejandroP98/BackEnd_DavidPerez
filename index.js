///// documentación @hubspot/api-client = https://developers.hubspot.com/docs/api/cms/hubdb

const express = require("express");
const path = require('path');
const app = express();
const dotenv = require("dotenv");
const hubspot = require("@hubspot/api-client");
const { unknownEndpoint } = require("./unknownEndpoint");
const { response } = require("express");

dotenv.config(); // Variables de entorno disponibles en el proyecto.
let PORT = 3000;
let TABLE = process.env.TABLE || "developer_test_4";
let apiKey = process.env.API_KEY || "";
const hubspotClient = new hubspot.Client({ apiKey });

// Configurar
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Establer middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Establer rutas

// Obtener todos los registros
app.get("/api/get-registers", async (request, response) => {
  try {
    const apiResponse =
      await hubspotClient.cms.hubdb.rowsApi.readDraftTableRows(TABLE);
    response.status(200).json({
      status: true,
      message: "Todos los datos encontrados",
      data: apiResponse.results,
    });
  } catch (e) {
    console.log(e);
    response
      .status(220)
      .json({ status: false, message: "error consultando registros", data: e });
  }
});

// Obtener un registro por id
app.get("/api/get-register-by-id/:id", async (request, response) => {
  try {
    const rowId = request.params.id;
    const apiResponse =
      await hubspotClient.cms.hubdb.rowsApi.getDraftTableRowById(TABLE, rowId);
    response.status(200).json({
      status: true,
      message: "Todos los datos encontrados",
      data: apiResponse,
    });
  } catch (e) {
    console.log(e);
    response
      .status(220)
      .json({ status: false, message: "error consultando registro", data: e });
  }
});

// Crear registro
app.post("/api/create-register", async (request, response) => {
  try {
    const apiResponse = await hubspotClient.cms.hubdb.rowsApi.createTableRow(
      TABLE,
      { values: request.body.values }
    );
    response
      .status(200)
      .json({ status: true, message: "Registro creado", data: apiResponse });
  } catch (e) {
    console.log(e);
    response.status(220).json({
      status: false,
      message: "error creando registro con éxito",
      data: e,
    });
  }
});

// Actualizar registro por id
app.post("/api/update-register/:id", async (request, response) => {
  const rowId = request.params.id;

  try {
    const apiResponse =
      await hubspotClient.cms.hubdb.rowsApi.updateDraftTableRow(TABLE, rowId, {
        values: request.body.values,
      });
    response.status(200).json({
      status: true,
      message: "Registro actualizado con éxito",
      data: apiResponse,
    });
  } catch (e) {
    console.log(e);
    response
      .status(220)
      .json({ status: false, message: "error actualizando registro", data: e });
  }
});

// Borrar registro por Id
app.post("/api/delete-register/:id", async (request, response) => {
  const rowId = request.params.id;

  try {
    const apiResponse =
      await hubspotClient.cms.hubdb.rowsApi.purgeDraftTableRow(TABLE, rowId);

    response.status(200).json({
      status: true,
      message: "Registro borrado con éxito",
      data: { rowId },
    });
  } catch (e) {
    console.log(e);
    response
      .status(220)
      .json({ status: false, message: "error borrando registro", data: e });
  }
});

// Middleware para ruta no encontrada
app.use(unknownEndpoint);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
