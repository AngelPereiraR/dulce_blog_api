import * as yup from 'yup'
import { es } from 'yup-locales'

yup.setLocale(es)
//estructura de la información que vamos a validar
const updateArticleSchema = yup.object({
  title: yup.string().optional().label('Título'),
  slug: yup.string().optional().nullable().label('Fragmento URL'),
  images: yup.array().of(yup.string().required()).optional().min(1).label('Imágenes'),
  excerpt: yup.string().optional().max(100).label('Entradilla'),
  content: yup.string().optional().min(100).label('Contenido'),
  subcategories: yup.array().of(yup.object({
    _id: yup.string().required().label('ID de la subcategoría'),
    name: yup.string().required().label('Nombre de la subcategoría'),
    slug: yup.string().required().label('Fragmento URL de la subcategoría'),
    enabled: yup.bool().required().label('Activado de la subcategoría'),
    created_at: yup.string().required().label('Fecha de creación de la subcategoría'),
    updated_at: yup.string().required().label('Fecha de actualización de la subcategoría')
  })).optional().min(1).label('Subcategorías'),
  author: yup.string().optional().default('Dulce'),
  published_at: yup.date().optional(),
  enabled: yup.bool().optional().default(false)
})

export { updateArticleSchema }
