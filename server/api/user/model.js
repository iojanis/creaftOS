import bcrypt from 'bcrypt'
import mongoose, { Schema } from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'
import { env } from '../../config'

const roles = ['user', 'admin']

const userSchema = new Schema(
  {
    email: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
      required: false,
      unique: false,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    uuid: {
      type: String,
      unique: false,
      required: false
    },
    user_version: {
      type: Number,
      required: true,
      default: 0
    },
    ip: {
      type: String
    },
    username: {
      type: String,
      unique: true,
      index: true,
      trim: true
    },
    xp: {
      type: Number,
      default: 111
    },
    online: {
      type: Boolean,
      default: false
    },
    last_online: {
      type: Number,
      default: 0
    },
    bounty: {
      type: Number,
      default: 0
    },
    teamed: {
      type: Boolean,
      default: false
    },
    team: {
      type: String,
      default: ''
    },
    last_item: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: roles,
      default: 'user'
    },
    kills: {
      type: Number,
      default: 0
    },
    total_kills: {
      type: Number,
      default: 0
    },
    joined_x: {
      type: Number,
      default: 0
    },
    joined_z: {
      type: Number,
      default: 0
    },
    joined_y: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next()
  }

  /* istanbul ignore next */
  const rounds = env === 'test' ? 1 : 9

  bcrypt
    .hash(this.password, rounds)
    .then((hash) => {
      this.password = hash
      next()
    })
    .catch(next)
})

userSchema.methods = {
  view (full) {
    const view = {}
    let fields = ['id', 'username', 'joined_x', 'joined_y', 'joined_z', 'role', 'xp', 'kills', 'total_kills', 'bounty', 'last_item', 'teamed', 'team', 'last_online', 'online']

    if (full) {
      fields = [...fields, 'email', 'createdAt']
    }

    fields.forEach((field) => {
      view[field] = this[field]
    })

    return view
  },

  authenticate (password) {
    return bcrypt
      .compare(password, this.password)
      .then(valid => (valid ? this : false))
  }
}

userSchema.statics = {
  roles
}

userSchema.plugin(mongooseKeywords, { paths: ['email', 'username'] })

const model = mongoose.model('User', userSchema)

export const { schema } = model
export default model
