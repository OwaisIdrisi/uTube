import multer from "multer"
import fs from 'fs'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    console.log(file);

    cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname)
  }
})

export const upload = multer({ storage: storage })

