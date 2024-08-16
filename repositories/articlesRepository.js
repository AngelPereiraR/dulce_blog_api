import slugify from 'slugify'
import { stripTags } from '../utils/stripTags.js'
import { ArticleModel } from './models/articleModel.js'
import { uploadImage } from '../utils/uploadImageToCloudinary.js'

const slugifyOptions = {
  lower: true
}

async function create(data) {

  const imagesUrl = []

  if (data.images) {
    for (let i = 0; i < data.images.length; i++) {
      const imageUrl = await uploadImage(data.images[i])
      imagesUrl.push(imageUrl)
    }
  }

  data.images = imagesUrl

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
  const articles = await list(onlyEnabled)

  const articlesList = []

  for (let i = 0; i < articles.length; i++) {
    for (let j = 0; j < articles[i].subcategories.length; j++) {
      if (articles[i].subcategories[j].slug === subcategorySlug) {
        articlesList.push(articles[i])
      }
    }
  }

  return articlesList;
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
