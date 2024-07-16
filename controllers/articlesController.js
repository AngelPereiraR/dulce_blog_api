import express from 'express'
import { updateArticleValidations } from '../validations/updateArticleValidations.js'
import { createArticleValidations } from '../validations/createArticleValidations.js'
import { articlesRepository } from '../repositories/articlesRepository.js'
import { validateObjectIdFormat } from '../validations/validateObjectIdFormat.js'
import { isValidObjectId } from 'mongoose'
import { sessionChecker } from '../security/sessionChecker.js'

const articlesController = express.Router()

articlesController.route('/articles')
.post(sessionChecker(['admin'], true),createArticleValidations, async (req, res) => {

  const createdItem = await articlesRepository.create(req.curatedBody)

  res.status(201).json(createdItem)
})
.get(sessionChecker(['admin','user'], false), async (req, res) => {
  const onlyEnabled = !req.isAdminUser
  const itemList = await articlesRepository.list(onlyEnabled)

  res.json(itemList)
})

articlesController.route('/articles/:id')
.get(sessionChecker(['admin','user'], false), async (req, res) => {
  const itemId = req.params.id
  const idIsObjectId = isValidObjectId(itemId)
  const onlyEnabled = !req.isAdminUser
  let item = null
  if(idIsObjectId){
    item = await articlesRepository.getOne(itemId, onlyEnabled)
  }
  if(!idIsObjectId){
    item = await articlesRepository.getOneBySlug(itemId, onlyEnabled)
  }

  if(!item){
    return res.status(404).json({message: `item con id ${itemId} no encontrado`})
  }

  res.json(item)
})
.put(sessionChecker(['admin'], true), validateObjectIdFormat(), updateArticleValidations, async (req, res) => {
  const itemId = req.params.id
  const item = await articlesRepository.update(itemId, req.curatedBody)

  if(!item) {
    return res.status(404).json({message: `item con id ${itemId} no encontrado`})
  }

  res.json(item)
})
.delete(sessionChecker(['admin'], true), validateObjectIdFormat(), async (req, res) => {
  const itemId = req.params.id
  const item = await articlesRepository.remove(itemId)

  if(!item) {
    return res.status(404).json({message: `item con id ${itemId} no encontrado`})
  }

  res.status(204).json()
})

export {articlesController}
