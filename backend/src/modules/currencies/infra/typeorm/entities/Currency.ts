import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity("currencies")
class Currency {
    @PrimaryColumn()
    id?: string;

    @Column()
    symbol: string;

    @Column()
    rate: number;

    @CreateDateColumn()
    created_at: Date;

    @CreateDateColumn()
    last_checked: Date;

    constructor() {
        if (!this.id) {
            this.id = uuidv4();
        }
        this.symbol = uuidv4();
        this.rate = 0;
        this.created_at = new Date();
        this.last_checked = new Date();
    }
}

export { Currency };
