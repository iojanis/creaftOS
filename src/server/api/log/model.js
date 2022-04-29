import mongoose, { Schema } from 'mongoose'

const logSchema = new Schema({
  body: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

logSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      body: this.body,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Log', logSchema)

export const schema = model.schema
export default model
