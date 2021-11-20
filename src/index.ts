import App from "./app"
import { CotationController } from "./controller/CotationController"

const app = new App([
    new CotationController()
])

app.listen()
