import { Column, Entity } from 'typeorm';

import { EntityBase } from '../../../base/entity.base';

@Entity('currencies')
export class CurrencyEntity extends EntityBase {
    @Column()
    name: string;
    @Column({ unique: true })
    code: string;
    @Column()
    ratio: number;
}
