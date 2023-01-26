import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity("currency")
class Currency {
    @PrimaryColumn()
    id?: string;

    @Column()
    code: string;

    @Column()
    codein: string;

    @Column()
    name: string;

    @Column()
    ask: string;

    @Column()
    type: string;

    @CreateDateColumn()
    created_at: Date;

    @CreateDateColumn()
    updated_at: Date;

    constructor() {
        if (!this.id) {
            this.id = uuidv4();
        }
    }
}

export { Currency };
