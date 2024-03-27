const { Schema, mongoose } = require("mongoose");
const { error } = require("node:console");
const { randomBytes, createHmac } = require("node:crypto");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/image.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModifies("password")) return;
  const salt = randomBytes(16).toString();
  const hasedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hasedPassword;

  next();
});

userSchema.static("matchPassword", async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("User Not found");

  const salt = user.salt;
  const userProvidedHash = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  if (hasedPassword !== userProvidedHash)
    throw new Error("UIncorrect Password");
  return user;
});
const User = mongoose.model("user", userSchema);
module.exports = User;
