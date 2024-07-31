import * as yup from 'yup'
import { es } from 'yup-locales'

yup.setLocale(es)
//estructura de la información que vamos a validar
const schema = yup.object({
  name: yup.string().optional().label('Nombre'),
  slug: yup.string().optional().nullable().label('Fragmento URL'),
  subcategories: yup.array().of(yup.object({
    _id: yup.string().required().label('ID de la subcategoría'),
    name: yup.string().required().label('Nombre de la subcategoría'),
    slug: yup.string().required().label('Fragmento URL de la subcategoría'),
    enabled: yup.bool().required().label('Activado de la subcategoría'),
    created_at: yup.string().required().label('Fecha de creación de la subcategoría'),
    updated_at: yup.string().required().label('Fecha de actualización de la subcategoría')
  })).optional().min(1).default([]).label('Subcategorías'),
  enabled: yup.bool().optional().default(false)
})

export const updateCategoryValidations = async (req, res, next) => {
  try {
    const data = await schema.validate(req.body, { abortEarly: false, stripUnknown: true })
    req.curatedBody = data
    next()
  } catch (e) {
    next(e)
  }
}
