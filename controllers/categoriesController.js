import express from 'express'
import { updateCategoryValidations } from '../validations/updateCategoryValidations.js'
import { createCategoryValidations } from '../validations/createCategoryValidations.js'
import { categoriesRepository } from '../repositories/categoriesRepository.js'
import { validateObjectIdFormat } from '../validations/validateObjectIdFormat.js'
import { isValidObjectId } from 'mongoose'
import { sessionChecker } from '../security/sessionChecker.js'

const categoriesController = express.Router()

categoriesController.route('/categories')
  .post(sessionChecker(['admin'], true), createCategoryValidations, async (req, res) => {

    const createdItem = await categoriesRepository.create(req.curatedBody)

    res.status(201).json(createdItem)
  })
  .get(sessionChecker(['admin', 'user'], false), async (req, res) => {
    const onlyEnabled = !req.isAdminUser
    const itemList = await categoriesRepository.list(onlyEnabled)

    res.json(itemList)
  })

categoriesController.route('/categories/:id')
  .get(sessionChecker(['admin', 'user'], false), async (req, res) => {
    const itemId = req.params.id
    const idIsObjectId = isValidObjectId(itemId)
    const onlyEnabled = !req.isAdminUser
    let item = null
    if (idIsObjectId) {
      item = await categoriesRepository.getOne(itemId, onlyEnabled)
    }
    if (!idIsObjectId) {
      item = await categoriesRepository.getOneBySlug(itemId, onlyEnabled)
    }

    if (!item) {
      return res.status(404).json({ message: `item con id ${itemId} no encontrado` })
    }

    res.json(item)
  })
  .put(sessionChecker(['admin'], true), validateObjectIdFormat(), updateCategoryValidations, async (req, res) => {
    const itemId = req.params.id
    const item = await categoriesRepository.update(itemId, req.curatedBody)

    if (!item) {
      return res.status(404).json({ message: `item con id ${itemId} no encontrado` })
    }

    res.json(item)
  })
  .delete(sessionChecker(['admin'], true), validateObjectIdFormat(), async (req, res) => {
    const itemId = req.params.id
    const item = await categoriesRepository.remove(itemId)

    if (!item) {
      return res.status(404).json({ message: `item con id ${itemId} no encontrado` })
    }

    res.status(204).json()
  })

export { categoriesController }
