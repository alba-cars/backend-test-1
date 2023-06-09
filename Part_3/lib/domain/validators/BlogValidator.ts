import Joi from 'joi';

export const BlogValidationSchema = Joi.object({
  reference: Joi.string(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  main_image: Joi.string().required(),
  additional_images: Joi.array().items(Joi.string()),
  date_time: Joi.number().required(),
});
