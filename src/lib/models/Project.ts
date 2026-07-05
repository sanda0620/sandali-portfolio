import mongoose, { Schema, model, models } from 'mongoose'

const ProjectSchema = new Schema({
  cat:          { type: String, required: true },
  year:         { type: String, default: '2026' },
  title:        { type: String, required: true },
  description:  { type: String, required: true },
  tags:         [String],
  gh:           String,
  img:          String,
  featured:     { type: Boolean, default: true },
  groupProject: { type: Boolean, default: false },
  status:       { type: String, default: 'completed' },
  dataScale:    Number,
  useSvg:       { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 },
}, { timestamps: true })

export const Project = models.Project || model('Project', ProjectSchema)
