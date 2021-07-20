import { celebrate, Joi, Segments } from 'celebrate';

export default celebrate({
    [Segments.QUERY]: Joi.object().keys({
        from: Joi.string().required().min(3),
        to: Joi.string().required().min(3),
        amount: Joi.string().required(),

    }),
});