import { Schema } from 'mongoose';
import { CurrencyEntityProps } from '../../../domain/entities/currency.entity';

const CurrencySchema = new Schema<CurrencyEntityProps>(
    {
        name: {
            type: String,
            minlength: 3,
            max_length: 255,
        },
        code: {
            type: String,
            unique: true,
            required: true,
            minlength: 3,
            max_length: 3,
        },
        codeIn: {
            type: String,
            required: true,
            minlength: 3,
            max_length: 3,
        },
        basePrice: {
            type: Number,
            required: true,
        },
        isFictitious: {
            type: Boolean,
            required: true,
        },
    },
    {
        timestamps: true,
        toObject: { useProjection: true },
        toJSON: { useProjection: true },
    }
);

export default CurrencySchema;
