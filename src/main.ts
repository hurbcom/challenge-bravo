import "dotenv/config";
import app from "./Routes";

const port = 3000;

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
