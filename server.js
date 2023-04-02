const cors = require("cors");
const express = require("express");
const APS = require("forge-apis");

const APS_CLIENT_ID = "U4gwrJ2cOIoHVsiAS250JMl2zc8PHynJ";
const APS_CLIENT_SECRET = "pEpCD8aNY40DKFyA";

let router = express.Router();
let app = express();
let publicAuthClient = new APS.AuthClientTwoLegged(
	APS_CLIENT_ID,
	APS_CLIENT_SECRET,
	["viewables:read"],
	true
);

getPublicToken = async () => {
	if (!publicAuthClient.isAuthorized()) {
		await publicAuthClient.authenticate();
	}
	return publicAuthClient.getCredentials();
};
app.use(cors());
app.use(
	router.get("/api/auth/token", async function (req, res, next) {
		try {
			res.json(await getPublicToken());
		} catch (err) {
			next(err);
		}
	})
);
app.listen(8080, function () {});

