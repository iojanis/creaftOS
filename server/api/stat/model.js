import mongoose, { Schema } from 'mongoose'

const statSchema = new Schema({
  attribute: {
    type: String
  },
  value: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

statSchema.methods = {
  view(full) {
    const view = {
      // simple view
      id: this.id,
      attribute: this.attribute,
      value: this.value,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Stat', statSchema)

export const schema = model.schema
export default model
