const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
    registrationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Registration",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    fullName: { type: String, required: true },
    dob: { type: Date, required: true },
    school: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
});

const roleSchema = new mongoose.Schema({
    roleName: {
        type: String,
        required: true,
        enum: ["Debater", "Adjudicator", "Observer"],
    },
    slots: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    registeredCount: {
        type: Number,
        default: 0,
    },
    availableSlots: {
        type: Number,
    },
    participants: [participantSchema],
    _id: false,
});

const tournamentSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        registrationStartDate: { type: Date, required: true },
        registrationEndDate: { type: Date, required: true },
        postPaymentRedirectUrl: { type: String },
        type: { type: String, enum: ["BP", "WSDC"] },
        platform: { type: String, enum: ["online", "offline"] },
        roles: [roleSchema],
        status: {
            type: String,
            enum: ["upcoming", "registration_open", "registration_closed", "ongoing", "completed"],
            default: "upcoming",
        },
    },
    {
        timestamps: true,
    }
);

tournamentSchema.pre("save", function (next) {
  if (this.isNew) {
    this.roles.forEach((role) => {
      if (typeof role.availableSlots !== "number") {
        role.availableSlots = role.slots;
      }
    });
  }
  next();
});

module.exports = mongoose.model("Tournament", tournamentSchema);
