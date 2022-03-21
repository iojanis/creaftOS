import mongoose, { Schema } from 'mongoose'

const zoneSchema = new Schema({
  name: {
    type: String
  },
  slug: {
    type: String
  },
  description: {
    type: String
  },
  team: {
    type: String
  },
  team_name: {
    type: String
  },
  username: {
    type: String
  },
  p1: {
    type: [String]
  },
  p2: {
    type: [String]
  },
  p3: {
    type: [String]
  },
  p4: {
    type: [String]
  },
  pcenter: {
    type: [String]
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

zoneSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      name: this.name,
      slug: this.slug,
      description: this.description,
      team: this.team,
      team_name: this.team_name,
      username: this.username,
      p1: this.p1,
      p2: this.p2,
      p3: this.p3,
      p4: this.p4,
      pcenter: this.pcenter,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Zone', zoneSchema)

export const schema = model.schema
export default model
