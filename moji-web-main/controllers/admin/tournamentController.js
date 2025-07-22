const Tournament = require("../../models/Tournament");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");
const cloudinary = require("../../config/cloudinary");
const uploadToCloudinary = require("../../utils/cloudinaryUploader");

// Create a new tournament
exports.createTournament = catchAsyncErrors(async (req, res, next) => {
  const tournamentData = { ...req.body };

  if (typeof tournamentData.roles === "string") {
    tournamentData.roles = JSON.parse(tournamentData.roles);
  }

  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, "tournaments");
    tournamentData.bannerUrl = result.secure_url;
    tournamentData.bannerPublicId = result.public_id;
  }

  const tournament = await Tournament.create(tournamentData);

  res.status(201).json({
    success: true,
    tournament,
  });
});

// Get all tournaments
exports.getAllTournaments = catchAsyncErrors(async (req, res, next) => {
  const tournaments = await Tournament.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    tournaments,
  });
});

// Get a single tournament by ID
exports.getTournamentById = catchAsyncErrors(async (req, res, next) => {
  const tournament = await Tournament.findById(req.params.id);
  if (!tournament) {
    return next(new ErrorHandler("Tournament not found", 404));
  }

  res.status(200).json({
    success: true,
    tournament,
  });
});

// Update a tournament
exports.updateTournament = catchAsyncErrors(async (req, res, next) => {
  let tournament = await Tournament.findById(req.params.id);
  if (!tournament) {
    return next(new ErrorHandler("Tournament not found", 404));
  }

  const updateData = { ...req.body };

  if (typeof updateData.roles === "string") {
    updateData.roles = JSON.parse(updateData.roles);
  }

  if (req.file) {
    if (tournament.bannerPublicId) {
      await cloudinary.uploader.destroy(tournament.bannerPublicId);
    }
    const result = await uploadToCloudinary(req.file.buffer, "tournaments");
    updateData.bannerUrl = result.secure_url;
    updateData.bannerPublicId = result.public_id;
  }

  tournament = await Tournament.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    tournament,
  });
});

// Delete a tournament
exports.deleteTournament = catchAsyncErrors(async (req, res, next) => {
  const tournament = await Tournament.findById(req.params.id);
  if (!tournament) {
    return next(new ErrorHandler("Tournament not found", 404));
  }
  if (tournament.bannerPublicId) {
    await cloudinary.uploader.destroy(tournament.bannerPublicId);
  }
  await tournament.remove();
  res.status(200).json({
    success: true,
    message: "Tournament deleted successfully",
  });
});

exports.togglePublishStatus = catchAsyncErrors(async (req, res, next) => {
  const tournament = await Tournament.findById(req.params.id);
  if (!tournament) {
    return next(new ErrorHandler("Tournament not found", 404));
  }

  tournament.is_active = !tournament.is_active;
  await tournament.save();

  res.status(200).json({
    success: true,
    message: `Tournament ${
      tournament.is_active ? "published" : "unpublished"
    } successfully`,
    tournament: tournament,
  });
}); 