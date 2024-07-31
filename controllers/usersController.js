import express from 'express'
import { createUserValidations } from '../validations/createUserValidations.js'
import { usersRepository } from '../repositories/usersRepository.js'
import { updateUserValidations } from '../validations/updateUserValidations.js'
import { loginUserValidations } from '../validations/loginUserValidations.js'
import { sha512 } from 'js-sha512'
import { validateObjectIdFormat } from '../validations/validateObjectIdFormat.js'
import { createUserToken } from '../utils/createUserToken.js'
import { sessionChecker } from '../security/sessionChecker.js'
import { ForbiddenError } from '../errors/ForbiddenError.js'
import slugify from 'slugify'

const usersController = express.Router()

usersController.route('/users')
  .post(createUserValidations, async (req, res, next) => {
    try {
      const existingUser = await usersRepository.getOneByEmail(req.curatedBody.email)

      if (existingUser) {
        return res.status(400).json({ message: 'Ya hay un usuario existente con esa dirección de correo' })
      }

      const createdItem = await usersRepository.create(req.curatedBody)

      delete createdItem.password

      res.status(201).json(createdItem)
    } catch (e) {
      next(e)
    }
  })
  .get(sessionChecker(['admin'], true), async (req, res) => {
    const itemList = await usersRepository.list()

    const preparedData = itemList.map((item) => {
      delete item.password
      return item
    })

    res.json(preparedData)
  })

usersController.route('/users/logins')
  .post(loginUserValidations, async (req, res) => {
    const userEmail = req.curatedBody.email
    const receivedPasswordHash = sha512(req.curatedBody.password)
    const user = await usersRepository.getOneByEmailAndPassword(userEmail, receivedPasswordHash)

    if (!user) {
      return res.status(401).json({ message: 'Usuario y/o contraseña incorrectos' })
    }

    const responseData = {
      jwt: createUserToken(user)
    }

    res.status(201).json(responseData)
  })

usersController.route('/users/:id')
  .get(sessionChecker(['admin'], true), validateObjectIdFormat(), async (req, res) => {
    const itemId = req.params.id
    if (!req.isAdminUser && itemId !== req.tokenData.id) {
      next(new ForbiddenError('Acceso no permitido'))
      return
    }
    const item = await usersRepository.getOne(itemId)
    if (!item) {
      return res.status(404).json({ message: `Usuario con id ${itemId} no encontrado` })
    }

    delete item.password

    res.json(item)
  })
  .put(sessionChecker(['admin'], true), validateObjectIdFormat(), updateUserValidations, async (req, res) => {
    const itemId = req.params.id
    if (!req.isAdminUser && itemId !== req.tokenData.id) {
      next(new ForbiddenError('Acceso no permitido'))
      return
    }

    const item = await usersRepository.update(itemId, req.curatedBody)

    if (!item) {
      return res.status(404).json({ message: `Usuario con id ${itemId} no encontrado` })
    }

    delete item.password

    res.json(item)
  })
  .delete(sessionChecker(['admin'], true), validateObjectIdFormat(), async (req, res) => {
    const itemId = req.params.id
    if (!req.isAdminUser && itemId !== req.tokenData.id) {
      next(new ForbiddenError('Acceso no permitido'))
      return
    }
    const item = await usersRepository.remove(itemId)

    if (!item) {
      return res.status(404).json({ message: `Usuario con id ${itemId} no encontrado` })
    }

    res.status(204).json()
  })

export { usersController }
