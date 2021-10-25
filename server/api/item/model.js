import mongoose, { Schema } from 'mongoose'

const itemSchema = new Schema(
  {
    username: {
      type: String
    },
    item: {
      type: String
    },
    name: {
      type: String
    },
    amount: {
      type: Number
    },
    market: {
      type: Boolean,
      default: false
    },
    price: {
      type: Number,
      default: 0
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

itemSchema.methods = {
  view(full) {
    const view = {
      // simple view
      id: this.id,
      username: this.username,
      item: this.item,
      name: this.name,
      amount: this.amount,
      market: this.market,
      price: this.price,
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

const model = mongoose.model('Item', itemSchema)

export const schema = model.schema
export default model
