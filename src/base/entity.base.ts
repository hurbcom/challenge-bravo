import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class EntityBase extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'is_active', type: 'boolean', default: true, nullable: false })
    isActive: boolean;

    @Column({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamptz', nullable: true })
    updatedAt?: Date;
}
