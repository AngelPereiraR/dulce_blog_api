import slugify from 'slugify'
import { SubcategoryModel } from './models/subcategoryModel.js'

const slugifyOptions = {
  lower: true
}

async function create(data) {

  const subcategories = await list()

  if (subcategories) {
    data.orderNumber = subcategories.length + 1
  }

  if (!data.slug) {
    data.slug = slugify(data.name, slugifyOptions)
  } else {
    data.slug = slugify(data.slug, slugifyOptions)
  }

  return await new SubcategoryModel(data).save()
}

async function list(onlyEnabled = true) {
  const params = {}
  if (onlyEnabled) params.enabled = true
  return await SubcategoryModel.find(params).sort({ created_at: 'asc' }).exec()
}

async function getOne(id, onlyEnabled = true) {
  const params = { _id: id }
  if (onlyEnabled) params.enabled = true
  return await SubcategoryModel.findOne(params).exec()
}

async function getOneBySlug(slug, onlyEnabled = true) {
  const params = { slug }
  if (onlyEnabled) params.enabled = true
  return await SubcategoryModel.findOne(params).exec()
}

async function update(id, data) {

  if (data.name && !data.slug) {
    data.slug = slugify(data.name, slugifyOptions)
  }
  data.slug = slugify(data.slug, slugifyOptions)

  if (data.orderNumber) {
    data.orderNumber = parseInt(data.orderNumber)
  }

  return await SubcategoryModel.findOneAndUpdate({ _id: id }, data, { new: true, runValidators: true }).exec()
}

async function remove(id) {
  return await SubcategoryModel.findOneAndDelete({ _id: id }).exec()
}

export const subcategoriesRepository = {
  create,
  list,
  getOne,
  getOneBySlug,
  update,
  remove
}
