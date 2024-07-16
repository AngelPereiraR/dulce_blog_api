import jwt from 'jsonwebtoken'

export const createUserToken = (user) => {
  //guardamos el secreto en una constantes
  const JWT_SECRET = process.env.JWT_SECRET
  const JWT_EXPIRATION_IN_DAYS = process.env.JWT_EXPIRATION_IN_DAYS

  //generar el payload para el token jwt
  const payload = {
    id: user._id,
    firstname: user.firstname,
    profile: user.profile
  }

  //generamos el token con el payload previamente confeccionado
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION_IN_DAYS
  })
}
