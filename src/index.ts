import "reflect-metadata";
import app from "@core/application";
import { wipe } from "@utils/cache";

app.bootstrap().then(() => wipe());
