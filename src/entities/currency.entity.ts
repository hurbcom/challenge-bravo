import { Entity, Column, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";


@Entity()
export class Currency {
  @PrimaryColumn("uuid")
  readonly id: string;

  @Column({type: "varchar", width: 7, unique: true})
  symbol: string;

  @Column({type: "varchar", width: 255})
  name: string;

  @Column({type: "float"})
  price: number;

  @Column("date")
  last_updated: Date;

  @Column("date")
  date_added: Date;
  
  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
    if (!this.last_updated) {
      this.last_updated = new Date()
    }
    if (!this.date_added) {
      this.date_added = new Date()
    }
  }
}