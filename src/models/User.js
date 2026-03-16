const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 60
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },

  password: {
    type: String,
    required: true,
    minlength: 6
  },

  phone: {
    type: String,
    trim: true
  },

  avatar: {
    type: String,
    default: null
  },

  role: {
    type: String,
    enum: ['user','admin'],
    default: 'user'
  },

  isActive: {
    type: Boolean,
    default: true
  }

},
{
  timestamps: true
}
);

userSchema.pre('save', async function() {
  if(!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = function(password){

  return bcrypt.compare(password, this.password);

};

module.exports = mongoose.model('User', userSchema);
