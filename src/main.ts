import "dotenv/config";
import debug from "debug";
import app from "./Routes";

const logger = debug("app:Main");
const port = 3000;

app.listen(port, () => {
    logger(`App listening on port ${port}`);
});
