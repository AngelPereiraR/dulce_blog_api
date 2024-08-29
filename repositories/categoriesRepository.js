import slugify from 'slugify'
import { CategoryModel } from './models/categoryModel.js'

const slugifyOptions = {
  lower: true
}

async function create(data) {

  const categories = list()

  if (categories) {
    data.orderNumber = categories.length + 1
  }

  if (!data.slug) {
    data.slug = slugify(data.name, slugifyOptions)
  } else {
    data.slug = slugify(data.slug, slugifyOptions)
  }

  return await new CategoryModel(data).save()
}

async function list(onlyEnabled = true) {
  const params = {}
  if (onlyEnabled) params.enabled = true
  return await CategoryModel.find(params).sort({ created_at: 'asc' }).exec()
}

async function getOne(id, onlyEnabled = true) {
  const params = { _id: id }
  if (onlyEnabled) params.enabled = true
  return await CategoryModel.findOne(params).exec()
}

async function getOneBySlug(slug, onlyEnabled = true) {
  const params = { slug }
  if (onlyEnabled) params.enabled = true
  return await CategoryModel.findOne(params).exec()
}

async function update(id, data) {

  if (data.name && !data.slug) {
    data.slug = slugify(data.name, slugifyOptions)
  }
  data.slug = slugify(data.slug, slugifyOptions)

  if (data.orderNumber) {
    data.orderNumber = parseInt(data.orderNumber)
  }

  return await CategoryModel.findOneAndUpdate({ _id: id }, data, { new: true, runValidators: true }).exec()
}

async function remove(id) {
  return await CategoryModel.findOneAndDelete({ _id: id }).exec()
}

export const categoriesRepository = {
  create,
  list,
  getOne,
  getOneBySlug,
  update,
  remove
}
