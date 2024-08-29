import * as yup from 'yup'
import { es } from 'yup-locales'

yup.setLocale(es)
//estructura de la información que vamos a validar
const schema = yup.object({
  name: yup.string().required().label('Nombre'),
  slug: yup.string().optional().nullable().label('Fragmento URL'),
  enabled: yup.bool().optional().default(false),
  orderNumber: yup.number().optional()
})

export const createSubcategoryValidations = async (req, res, next) => {
  try {
    const data = await schema.validate(req.body, { abortEarly: false, stripUnknown: true })
    req.curatedBody = data
    next()
  } catch (e) {
    next(e)
  }
}
