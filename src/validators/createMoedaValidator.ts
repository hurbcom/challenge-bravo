import { celebrate, Joi, Segments } from 'celebrate';

export default celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        sigla: Joi.string().required().min(3),
        valueInReal: Joi.number().required(),

    }),
});