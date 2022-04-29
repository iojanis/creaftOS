import mongoose, { Schema } from 'mongoose'

const tokenSchema = new Schema(
  {
    username: {
      type: String
    },
    code: {
      type: Number
    },
    activation: {
      type: Boolean
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (obj, ret) => {
        delete ret._id
      }
    }
  }
)

tokenSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      username: this.username,
      code: this.code,
      activation: this.activation,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full
      ? {
          ...view
          // add properties for a full view
        }
      : view
  }
}

const model = mongoose.model('Token', tokenSchema)

export const schema = model.schema
export default model
