import { Column, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

import { getTomorrowDate } from "../../../../../shared/utils/dateOperation";

@Entity("currencies")
class Currency {
  @PrimaryColumn()
  id?: string;

  @Column({ name: "currency_code" })
  currencyCode: string;

  @Column({ name: "currency_name" })
  currencyName: string;

  @Column({ name: "price_usd" })
  priceUsd: number;

  @Column()
  isFictional: boolean;

  @Column({ name: "expire_at" })
  expireAt: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }

    const tomorrow = getTomorrowDate();

    this.expireAt = tomorrow;
  }
}

export { Currency };
