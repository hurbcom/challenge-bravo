import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity("coins")
class Quotation {
    @PrimaryColumn()
    id?: string;

    @Column()
    code: string;

    @Column()
    name: string;

    @Column()
    high: string;

    @Column()
    low: string;

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

export { Quotation };
