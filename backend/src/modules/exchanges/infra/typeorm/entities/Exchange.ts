import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity("exchanges")
class Exchange {
    @PrimaryColumn()
    id: string;

    @Column()
    from: string;

    @Column()
    to: string;

    @Column()
    amount: number;

    @Column()
    value: number;

    @Column()
    rate: number;

    @Column()
    base: string;

    @CreateDateColumn()
    created_date: Date;

    @CreateDateColumn()
    expires_date: Date;

    constructor() {
        if (!this.id) {
            this.id = uuidv4();
        }
    }
}

export { Exchange };
