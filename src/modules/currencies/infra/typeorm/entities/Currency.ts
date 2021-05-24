import dayjs from "dayjs";
import { Column, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("currencies")
class Currency {
  @PrimaryColumn()
  id: string;

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

      const tomorrow = dayjs()
        .add(1, "day")
        .set("hour", 0)
        .set("minute", 0)
        .set("second", 0)
        .set("millisecond", 0)
        .toDate();

      this.expireAt = tomorrow;
    }
  }
}

export { Currency };
