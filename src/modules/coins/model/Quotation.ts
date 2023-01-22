import { v4 as uuidv4 } from "uuid";

class Quotation {
    id?: string;
    code: string;
    name: string;
    high: string;
    low: string;
    type: string;
    created_at: Date;
    updated_at: Date;

    constructor() {
        if (!this.id) {
            this.id = uuidv4();
        }
    }
}

export { Quotation };
