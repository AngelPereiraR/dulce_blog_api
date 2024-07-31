import express from 'express'
import { updateSubcategoryValidations } from '../validations/updateSubcategoryValidations.js'
import { createSubcategoryValidations } from '../validations/createSubcategoryValidations.js'
import { subcategoriesRepository } from '../repositories/subcategoriesRepository.js'
import { validateObjectIdFormat } from '../validations/validateObjectIdFormat.js'
import { isValidObjectId } from 'mongoose'
import { sessionChecker } from '../security/sessionChecker.js'
import slugify from 'slugify'

const subcategoriesController = express.Router()

subcategoriesController.route('/subcategories')
  .post(sessionChecker(['admin'], true), createSubcategoryValidations, async (req, res, next) => {
    try {
      const existingSubcategory = await subcategoriesRepository.getOneBySlug(slugify(req.curatedBody.name, { lower: true }), false)

      if (existingSubcategory) {
        return res.status(400).json({ message: 'Ya hay una subcategoría existente con ese nombre' })
      }

      const createdItem = await subcategoriesRepository.create(req.curatedBody)

      res.status(201).json(createdItem)
    } catch (e) {
      next(e)
    }
  })
  .get(sessionChecker(['admin', 'user'], false), async (req, res) => {
    const onlyEnabled = !req.isAdminUser
    const itemList = await subcategoriesRepository.list(onlyEnabled)

    res.json(itemList)
  })

subcategoriesController.route('/subcategories/:id')
  .get(sessionChecker(['admin', 'user'], false), async (req, res) => {
    const itemId = req.params.id
    const idIsObjectId = isValidObjectId(itemId)
    const onlyEnabled = !req.isAdminUser
    let item = null
    if (idIsObjectId) {
      item = await subcategoriesRepository.getOne(itemId, onlyEnabled)
    }
    if (!idIsObjectId) {
      item = await subcategoriesRepository.getOneBySlug(itemId, onlyEnabled)
    }

    if (!item) {
      return res.status(404).json({ message: `Subcategoría con id ${itemId} no encontrada` })
    }

    res.json(item)
  })
  .put(sessionChecker(['admin'], true), validateObjectIdFormat(), updateSubcategoryValidations, async (req, res) => {
    const itemId = req.params.id
    const item = await subcategoriesRepository.update(itemId, req.curatedBody)

    if (!item) {
      return res.status(404).json({ message: `Subcategoría con id ${itemId} no encontrada` })
    }

    res.json(item)
  })
  .delete(sessionChecker(['admin'], true), validateObjectIdFormat(), async (req, res) => {
    const itemId = req.params.id
    const item = await subcategoriesRepository.remove(itemId)

    if (!item) {
      return res.status(404).json({ message: `Subcategoría con id ${itemId} no encontrada` })
    }

    res.status(204).json()
  })

export { subcategoriesController }
