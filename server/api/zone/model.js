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
  p1x: {
    type: Number
  },
  p1z: {
    type: Number
  },
  p2x: {
    type: Number
  },
  p2z: {
    type: Number
  },
  p3x: {
    type: Number
  },
  p3z: {
    type: Number
  },
  p4x: {
    type: Number
  },
  p4z: {
    type: Number
  },
  pcx: {
    type: Number
  },
  pcy: {
    type: Number
  },
  pcz: {
    type: Number
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
      p1x: this.p1x,
      p1z: this.p1z,
      p2x: this.p2x,
      p2z: this.p2z,
      p3x: this.p3x,
      p3z: this.p3z,
      p4x: this.p4x,
      p4z: this.p4z,
      pcx: this.pcx,
      pcy: this.pcy,
      pcz: this.pcz,
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
