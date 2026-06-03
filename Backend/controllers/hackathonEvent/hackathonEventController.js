const db = require("../../database/db");
const AppError = require("../../utils/appError");
const catchAsyncError = require("../../utils/catchAsyncError");

const selectHackathonEventById = async (id) => {
  const [event] = await db("SELECT * FROM hackathon_events WHERE id = ?", [id]);
  return event;
};

exports.createHackathonEvent = catchAsyncError(async (req, res, next) => {
  const { event_name } = req.body;

  if (!event_name) {
    return next(new AppError("event_name is required", 400));
  }

  const result = await db(
    "INSERT INTO hackathon_events (event_name) VALUES (?)",
    [event_name],
  );

  const newEvent = await selectHackathonEventById(result.insertId);

  res.status(201).json({
    status: "success",
    data: {
      hackathon_event: newEvent,
    },
  });
});

exports.getAllHackathonEvents = catchAsyncError(async (req, res) => {
  const { search } = req.query;
  let events;

  if (search) {
    events = await db(
      "SELECT * FROM hackathon_events WHERE event_name LIKE ? ORDER BY id DESC",
      [`%${search}%`],
    );
  } else {
    events = await db("SELECT * FROM hackathon_events ORDER BY id DESC");
  }

  res.status(200).json({
    status: "success",
    results: events.length,
    data: {
      hackathon_events: events,
    },
  });
});

exports.getHackathonEventById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const event = await selectHackathonEventById(id);

  if (!event) {
    return next(new AppError("Hackathon event not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      hackathon_event: event,
    },
  });
});

exports.updateHackathonEventById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { event_name } = req.body;

  if (!event_name) {
    return next(new AppError("event_name is required", 400));
  }

  const result = await db(
    "UPDATE hackathon_events SET event_name = ? WHERE id = ?",
    [event_name, id],
  );

  if (result.affectedRows === 0) {
    return next(new AppError("Hackathon event not found", 404));
  }

  const updatedEvent = await selectHackathonEventById(id);

  res.status(200).json({
    status: "success",
    data: {
      hackathon_event: updatedEvent,
    },
  });
});

exports.deleteHackathonEventById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const result = await db("DELETE FROM hackathon_events WHERE id = ?", [id]);

  if (result.affectedRows === 0) {
    return next(new AppError("Hackathon event not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Hackathon event deleted successfully",
    data: null,
  });
});
