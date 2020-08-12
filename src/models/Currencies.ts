import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('currencies')
class Currencies {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    code: string;

    @Column()
    name: string;
}

export default Currencies;
