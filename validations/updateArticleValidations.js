import * as yup from 'yup'
import { es } from 'yup-locales'

yup.setLocale(es)
//estructura de la información que vamos a validar
const schema = yup.object({
  title: yup.string().required().label('Título'),
  slug: yup.string().optional().nullable().label('Fragmento URL'),
  image: yup.string().required().label('Imagen'),
  excerpt: yup.string().optional().max(100).label('Entradilla'),
  content: yup.string().required().min(100).label('Contenido'),
  subcategories: yup.array().of(yup.object({
    name: yup.string().required().label('Nombre'),
    slug: yup.string().optional().nullable().label('Fragmento URL'),
    enabled: yup.bool().optional().default(false)
  })).optional().min(1).default([]).label('Subcategorías'),
  author: yup.string().optional().default('Dulce'),
  published_at: yup.date().optional(),
  enabled: yup.bool().optional().default(false)
})

export const updateArticleValidations = async (req, res, next) => {
  try {
    const data = await schema.validate(req.body, { abortEarly: false, stripUnknown: true })
    req.curatedBody = data
    next()
  } catch (e) {
    next(e)
  }
}
