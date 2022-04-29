import mongoose, { Schema } from 'mongoose'

const eventSchema = new Schema({
  content: {
    type: String
  },
  username: {
    type: String
  },
  link: {
    type: String
  },
  public: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

eventSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      content: this.content,
      username: this.username,
      link: this.link,
      public: this.public,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Event', eventSchema)

export const schema = model.schema
export default model
