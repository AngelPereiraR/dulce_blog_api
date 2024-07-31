import { sha512 } from 'js-sha512'
import { UserModel } from './models/userModel.js'

async function create(data) {
  data.password = sha512(data.password)

  return await new UserModel(data).save()
}

async function list() {
  return await UserModel.find().sort({ created_at: 'asc' }).exec()
}

async function getOne(id, onlyEnabled = true) {
  const params = { _id: id }
  if (onlyEnabled) params.enabled = true
  return await UserModel.findOne(params).exec()
}

async function remove(id) {
  return await UserModel.findOneAndDelete({ _id: id }).exec()
}

async function update(id, data) {
  return await UserModel.findOneAndUpdate({ _id: id }, data, { new: true, runValidators: true }).exec()
}

async function getOneByEmail(email, onlyEnabled = true) {
  const params = { email: email }
  if (onlyEnabled) params.enabled = true
  return await UserModel.findOne(params).exec()
}

async function getOneByEmailAndPassword(email, password) {
  return await UserModel.findOne({ email, password, enabled: true }).exec()
}

export const usersRepository = {
  list,
  create,
  getOne,
  remove,
  update,
  getOneByEmailAndPassword,
  getOneByEmail
}
