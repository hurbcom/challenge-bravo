import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity('currency')
export class CurrencyEntity {
	@PrimaryGeneratedColumn('uuid')
	public id: string

	@Column({ nullable: false })
	public code: string

	@Column({ name: 'backed_currency_code', nullable: false })
	public backedCurrencyCode: string

	@Column({ name: 'unit_cost', nullable: false })
	public unitCost: string

	@CreateDateColumn({ name: 'created_at', type: 'timestamptz', nullable: false })
	public createdAt: Date

	@UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: false })
	public updatedAt: Date
}