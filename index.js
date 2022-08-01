const express = require("express");

const { google } = require("googleapis");


const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index");
})

app.post("/", async(req, res) => {

    const { request, name } = req.body;

    const auth = new google.auth.GoogleAuth({
        keyFile: "credential.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    })


    const client = await auth.getClient();


    const googleSheets = google.sheets({ version: "v4", auth: client })


    const spreadsheetId = "1LexWmtOTcRDrRUw1cFxsvfBAkPhZ4_tPByPVALIU_9g"


    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId
    });

    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Sheet1",
    });


    await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Sheet1!A:B",
        valueInputOption: "USER_ENTERED",

        resource: {
            values: [
                [request, name]
            ],
        }
    })


    res.send("sucessfully");
});


app.listen(1337, (req, res) => console.log("running"));