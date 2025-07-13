const mongoose = require("mongoose");

// --- Define specific participant schemas for better validation ---
const CourseParticipantSchema = new mongoose.Schema(
  {
    course_title: { type: String, required: true },
    class_title: { type: String, required: true },
    name: { type: String, required: true },
    tuition_fee: { type: Number, required: true },
    discount_type: { type: String },
  },
  { _id: false }
);

const TournamentParticipantSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    dob: { type: Date, required: true },
    school: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },
  { _id: false }
);

const TransactionSchema = new mongoose.Schema(
  {
    // --- Common Fields ---
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderCode: { type: String, required: true, unique: true },
    status: {
      type: String,
      required: true,
      enum: ["PENDING", "COMPLETED", "FAILED", "CANCELLED", "EXPIRED"],
    },
    totalAmount: { type: Number, required: true },
    checkoutUrl: { type: String },
    description: { type: String },

    // --- Discriminator ---
    transactionType: {
      type: String,
      required: true,
      enum: ["COURSE_PURCHASE", "TOURNAMENT_REGISTRATION"],
    },

    // --- Unified Details Field ---
    details: {
      // Course-specific
      classes: [{
          class_id: { type: mongoose.Schema.Types.ObjectId },
          ebHold: { type: Number, required: true },
          _id: false
      }],
      participants: [CourseParticipantSchema],

      // Tournament-specific
      tournament_id: { type: mongoose.Schema.Types.ObjectId, ref: "Tournament" },
      role: { type: String },
      tournament_participants: [TournamentParticipantSchema],
    },

    // --- Single TTL Field ---
    expiryAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// --- Single TTL Index ---
TransactionSchema.index({ expiryAt: 1 }, { expireAfterSeconds: 0 });

// --- Unified Middleware for Expiry Logic on Save ---
// --- CORRECTED Unified Middleware for Expiry Logic on Save ---
TransactionSchema.pre("save", function (next) {
  // Case 1: Final statuses that should have no expiry date.
  if (["COMPLETED", "FAILED"].includes(this.status)) {
    this.expiryAt = null;
  }
  // Case 2: PENDING status. Only set a *new* expiry if one isn't already defined.
  else if (this.status === "PENDING" && !this.expiryAt) {
    if (this.transactionType === "TOURNAMENT_REGISTRATION") {
      this.expiryAt = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes
    } else if (this.transactionType === "COURSE_PURCHASE") {
      this.expiryAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    }
  }
  // Case 3: CANCELLED status for courses has its own expiry logic.
  else if (
    this.status === "CANCELLED" &&
    this.transactionType === "COURSE_PURCHASE"
  ) {
    this.expiryAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week
  }

  // By removing the final 'else' block, a transaction like the one in your test
  // (status: PENDING, expiryAt: already set) will pass through unmodified, which is correct.

  next();
});

// --- Unified Middleware for Expiry Logic on Update ---
TransactionSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (!update.$set || !update.$set.status) {
    return next();
  }

  const status = update.$set.status;
  const transactionType = this.getQuery().transactionType; // Get type from query filter

  if (["COMPLETED", "FAILED"].includes(status)) {
    this.set({ expiryAt: null });
  } else if (status === "PENDING") {
    if (transactionType === "COURSE_PURCHASE") {
      this.set({ expiryAt: new Date(Date.now() + 60 * 60 * 1000) });
    } else if (transactionType === "TOURNAMENT_REGISTRATION") {
      this.set({ expiryAt: new Date(Date.now() + 3 * 60 * 1000) });
    }
  } else if (status === "CANCELLED" && transactionType === "COURSE_PURCHASE") {
    this.set({ expiryAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
  } else {
    this.set({ expiryAt: null });
  }

  next();
});

module.exports = mongoose.model("Transaction", TransactionSchema);
