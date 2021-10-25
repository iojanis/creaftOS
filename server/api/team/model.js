import mongoose, { Schema } from 'mongoose'

const teamSchema = new Schema({
  name: {
    type: String
  },
  slug: {
    type: String
  },
  description: {
    type: String
  },
  leader: {
    type: String
  },
  whitelist: {
    type: String
  },
  xp: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

teamSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      name: this.name,
      slug: this.slug,
      description: this.description,
      leader: this.leader,
      whitelist: this.whitelist,
      xp: this.xp,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Team', teamSchema)

export const schema = model.schema
export default model
