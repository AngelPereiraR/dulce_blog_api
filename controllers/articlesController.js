import express from 'express'
import { updateArticleSchema } from '../validations/updateArticleValidations.js'
import { createArticleSchema } from '../validations/createArticleValidations.js'
import { articlesRepository } from '../repositories/articlesRepository.js'
import { validateObjectIdFormat } from '../validations/validateObjectIdFormat.js'
import { isValidObjectId } from 'mongoose'
import { sessionChecker } from '../security/sessionChecker.js'
import slugify from 'slugify'
import formidable from 'formidable'

const articlesController = express.Router()

articlesController.route('/articles')
  .post(sessionChecker(['admin'], true), async (req, res, next) => {
    try {
      const form = formidable({ multiples: true });
      form.parse(req, async (err, fields, files) => {
        req.curatedBody = fields

        if (files && files.images) {
          req.curatedBody.images = []
          for (let i = 0; i < files.images.length; i++) {
            req.curatedBody.images.push(files.images[i].filepath)
          }
        }

        if (fields.title) req.curatedBody.title = fields.title.toString()
        if (fields.slug) req.curatedBody.slug = fields.slug.toString()
        if (fields.excerpt) req.curatedBody.excerpt = fields.excerpt.toString()
        if (fields.content) req.curatedBody.content = fields.content.toString()
        if (fields.subcategories) {
          req.curatedBody.subcategories = JSON.parse(fields.subcategories[0])
        }
        if (fields.enabled) {
          if (fields.enabled.toString() === 'true') {
            req.curatedBody.enabled = true
          } else {
            req.curatedBody.enabled = false
          }
        }
        if (fields.author) req.curatedBody.author = fields.author.toString()
        if (fields.published_at) req.curatedBody.published_at = fields.published_at.toString()

        const existingArticle = await articlesRepository.getOneBySlug(slugify(fields.title.toString(), { lower: true }), false);

        if (existingArticle) {
          return res.status(400).json({ message: 'Ya hay un artículo existente con ese nombre' });
        }
        const validatedData = await createArticleSchema.validate(req.curatedBody, { abortEarly: false, stripUnknown: true });

        const createdItem = await articlesRepository.create(validatedData);

        res.status(201).json(createdItem);
      })

    } catch (e) {
      next(e);
    }
  })
  .get(sessionChecker(['admin', 'user'], false), async (req, res) => {
    const onlyEnabled = !req.isAdminUser
    const subcategorySlug = req.query.subcategorySlug
    let itemList = null

    if (subcategorySlug) {
      itemList = await articlesRepository.listBySubcategorySlug(subcategorySlug)
    } else {
      itemList = await articlesRepository.list(onlyEnabled)
    }

    if (itemList.length === 0) {
      return res.status(404).json({ message: `No se ha encontrado ningún artículo perteneciente a esa subcategoría` })
    }

    res.json(itemList)
  })

articlesController.route('/articles/:id')
  .get(sessionChecker(['admin', 'user'], false), async (req, res) => {
    const itemId = req.params.id
    const idIsObjectId = isValidObjectId(itemId)
    const onlyEnabled = !req.isAdminUser
    let item = null
    if (idIsObjectId) {
      item = await articlesRepository.getOne(itemId, onlyEnabled)
    }
    if (!idIsObjectId) {
      item = await articlesRepository.getOneBySlug(itemId, onlyEnabled)
    }

    if (!item) {
      return res.status(404).json({ message: `Artículo con id ${itemId} no encontrado` })
    }

    res.json(item)
  })
  .put(sessionChecker(['admin'], true), validateObjectIdFormat(), async (req, res) => {
    const itemId = req.params.id
    try {
      const form = formidable({ multiples: true });
      form.parse(req, async (err, fields, files) => {
        req.curatedBody = fields

        if (files && files.image) {
          req.curatedBody.image = files.image[0].filepath;
        }

        if (fields.title) req.curatedBody.title = fields.title.toString()
        if (fields.slug) req.curatedBody.slug = fields.slug.toString()
        if (fields.excerpt) req.curatedBody.excerpt = fields.excerpt.toString()
        if (fields.content) req.curatedBody.content = fields.content.toString()
        if (fields.subcategories) {
          req.curatedBody.subcategories = JSON.parse(fields.subcategories[0])
        }
        if (fields.enabled) {
          if (fields.enabled.toString() === 'true') {
            req.curatedBody.enabled = true
          } else {
            req.curatedBody.enabled = false
          }
        }
        if (fields.author) req.curatedBody.author = fields.author.toString()
        if (fields.published_at) req.curatedBody.published_at = fields.published_at.toString()

        const validatedData = await updateArticleSchema.validate(req.curatedBody, { abortEarly: false, stripUnknown: true });

        const item = await articlesRepository.update(itemId, validatedData)

        if (!item) {
          return res.status(404).json({ message: `Artículo con id ${itemId} no encontrado` })
        }

        res.json(item)
      })

    } catch (e) {
      next(e);
    }
  })
  .delete(sessionChecker(['admin'], true), validateObjectIdFormat(), async (req, res) => {
    const itemId = req.params.id
    const item = await articlesRepository.remove(itemId)

    if (!item) {
      return res.status(404).json({ message: `Artículo con id ${itemId} no encontrado` })
    }

    res.status(204).json()
  })

export { articlesController }
