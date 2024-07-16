import jwt from 'jsonwebtoken'
import { SessionRequiredError } from "../errors/SessionRequiredError.js"
import { ForbiddenError } from "../errors/ForbiddenError.js"
import { usersRepository } from '../repositories/usersRepository.js'

export const sessionChecker = (allowedProfiles = [], isMandatory = true) => {
  return async (req, res, next) => {
    // guardamos el token previamente extraído por express-bearer-token
    const token = req.token || null

    // si no hay sesión y es obligatoria, cortamos ejecución y devolvemos error
    if(!token && isMandatory) {
      return next(new SessionRequiredError('session is required'))
    }

    //si no hay sesión y es opcional, establecemos en la petición datos vacíos para el token y pasamos el testigo
    if(!token && !isMandatory) {
      req.tokenData = null
      req.isAdminUser = false

      return next()
    }

    try{
      const JWT_SECRET = process.env.JWT_SECRET
      const tokenData = jwt.verify(token, JWT_SECRET)

      if(!allowedProfiles.includes(tokenData.profile)){
        return next(new ForbiddenError('access not allowed'))
      }

      const user = await usersRepository.getOne(tokenData.id)

      if(!user){
        return next(new ForbiddenError('access not allowed'))
      }

      req.tokenData = tokenData
      req.isAdminUser = tokenData.profile === 'admin'

      next()
    }catch(err){
      next(err)
    }
  }
}
