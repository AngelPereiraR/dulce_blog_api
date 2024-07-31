import slugify from 'slugify'
import { stripTags } from '../utils/stripTags.js'
import { ArticleModel } from './models/articleModel.js'
import { uploadImage } from '../utils/uploadImageToCloudinary.js'

const slugifyOptions = {
  lower: true
}

async function create(data) {

  const imageUrl = await uploadImage(data.image)

  data.image = imageUrl

  if (!data.slug) {
    data.slug = slugify(data.title, slugifyOptions)
  } else {
    data.slug = slugify(data.slug, slugifyOptions)
  }
  if (!data.excerpt) {
    data.excerpt = stripTags(data.content).substring(0, 100)
  }
  if (!data.subcategories) {
    data.subcategories = []
  }

  return await new ArticleModel(data).save()
}

async function list(onlyEnabled = true) {
  const params = {}
  if (onlyEnabled) params.enabled = true
  return await ArticleModel.find(params).sort({ createdAt: 'asc' }).exec()
}

async function listBySubcategorySlug(subcategorySlug, onlyEnabled = true) {
  const params = {}
  if (onlyEnabled) params.enabled = true
  if (subcategorySlug) params.subcategories[0] = subcategorySlug
  return await ArticleModel.find(params).sort({ createdAt: 'asc' }).exec()
}

async function getOne(id, onlyEnabled = true) {
  const params = { _id: id }
  if (onlyEnabled) params.enabled = true
  return await ArticleModel.findOne(params).exec()
}

async function getOneBySlug(slug, onlyEnabled = true) {
  const params = { slug }
  if (onlyEnabled) params.enabled = true
  return await ArticleModel.findOne(params).exec()
}

async function update(id, data) {

  if (data.image) {
    const imageUrl = await uploadImage(data.image)
    data.image = imageUrl
  }

  if (data.title && !data.slug) {
    data.slug = slugify(data.title, slugifyOptions)
  }
  else if (data.slug) {
    data.slug = slugify(data.slug, slugifyOptions)
  }

  if (data.content && !data.excerpt) {
    data.excerpt = stripTags(data.content).substring(0, 100)
  }

  return await ArticleModel.findOneAndUpdate({ _id: id }, data, { new: true, runValidators: true }).exec()
}

async function remove(id) {
  return await ArticleModel.findOneAndDelete({ _id: id }).exec()
}

export const articlesRepository = {
  create,
  list,
  listBySubcategorySlug,
  getOne,
  getOneBySlug,
  update,
  remove
}
