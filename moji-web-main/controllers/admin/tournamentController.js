const Tournament = require("../../models/Tournament");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");
const ErrorHandler = require("../../utils/errorHandler");

// Create a new tournament
exports.createTournament = catchAsyncErrors(async (req, res, next) => {
  const tournament = await Tournament.create(req.body);
  res.status(201).json({
    success: true,
    tournament,
  });
});

// Get all tournaments
exports.getAllTournaments = catchAsyncErrors(async (req, res, next) => {
  const tournaments = await Tournament.find();
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
  tournament = await Tournament.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
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
  await tournament.remove();
  res.status(200).json({
    success: true,
    message: "Tournament deleted successfully",
  });
}); 