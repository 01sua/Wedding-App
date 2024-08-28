import express, { Express } from "express";
import bodyParser from 'body-parser';
import { addGuest, getGuest, listGuesets } from "./routes";


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.get("/api/list", listGuesets);
app.post("/api/add", addGuest);
app.get("/api/get", getGuest);
app.listen(port, () => console.log(`Server listening on ${port}`));
