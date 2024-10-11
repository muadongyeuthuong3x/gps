const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, require: true },
    password: { type: String, require: true },
    user_infor_base64: { type: String, require: true },
    token: { type: String, default: "" },
  },
  { timestamps: true }
);

const UserSchema = mongoose.model('User', userSchema);
export default UserSchema;