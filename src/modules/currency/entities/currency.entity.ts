import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { format } from 'date-fns';
import { Document } from 'mongoose';

export type CurrencyDocument = Currency & Document;
@Schema()
export class Currency {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    code: string;

    @Prop({ required: true })
    exchangeRate: string;

    @Prop({ required: false, default: 'FICTICIUS' })
    type?: 'FIAT' | 'CRYPTO' | 'FICTICIUS';

    @Prop({ required: false, default: 'USD' })
    backing?: string;

    @Prop({ default: format(new Date(), 'yyyy-MM-dd') })
    created: string;

    @Prop()
    deleted?: Date;
}
export const CurrencySchema = SchemaFactory.createForClass(Currency);
