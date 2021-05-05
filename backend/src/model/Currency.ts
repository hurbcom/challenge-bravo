import { v4 as uuidv4 } from "uuid";

class Currency {
    id?: string;
    symbol: string;
    created_at: Date;
    last_checked: Date;

    constructor() {
        if (!this.id) {
            this.id = uuidv4();
        }
        this.symbol = uuidv4();
        this.created_at = new Date();
        this.last_checked = new Date();
    }
}

export { Currency };
