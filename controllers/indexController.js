import express from 'express'

const indexController = express.Router()

indexController.route('/')
  .get((req, res) => {
    console.info("token: ", req.tokenData)
    const apiVersion = { version: process.env.API_VERSION || '1.0.0' }
    res.json(apiVersion)
  })

export { indexController }
