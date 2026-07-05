import { Schema, model, models } from 'mongoose'

const CertificateSchema = new Schema({
  name:         { type: String, required: true },
  issuer:       String,
  file:         String,
  fileType:     String,
  displayOrder: { type: Number, default: 0 },
}, { timestamps: true })

export const Certificate = models.Certificate || model('Certificate', CertificateSchema)
