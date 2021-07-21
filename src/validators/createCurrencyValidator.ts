import { celebrate, Joi, Segments } from 'celebrate';

export default celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        code: Joi.string().required().min(3),
        valueInUSD: Joi.number().required(),

    }),
});