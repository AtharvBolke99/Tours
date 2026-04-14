import Tours from "../models/Tours.js";

const gettours = async (req, res) => {
  try {
    const tours = await Tours.find({ user: req.user.id }).populate(
      "user",
      "-password",
    );
    return res.json({
      status: true,
      message: "Tours fetched successfully",
      data: tours,
    });
  } catch (error) {
    return res.json({
      status: false,
      message: error.message,
      data: null,
    });
  }
};

const getAllTours = async (req, res) => {
  try {
    const tours = await Tours.find({}).populate(
      "user",
      "-password",
    );
    return res.json({
      status: true,
      message: "All tours fetched successfully",
      data: tours,
    });
  } catch (error) {
    return res.json({
      status: false,
      message: error.message,
      data: null,
    });
  }
};

const posttours = async (req, res) => {
  const { title, description, city, startDate, endDate, photos } = req.body;
  const newTour = new Tours({
    title,
    description,
    city,
    startDate,
    endDate,
    user: req.user.id,
    photos,
  });

  try {
    const saveTour = await newTour.save();
    return res.json({
      status: true,
      message: "Tour created successfully",
      data: saveTour,
    });
  } catch (error) {
    return res.json({
      status: false,
      message: error.message,
      data: null,
    });
  }
};

const updatetours = async (req, res) => {
  const { id } = req.params;
  const { title, description, city, startDate, endDate, photos } = req.body;

  try {
    const tour = await Tours.findOne({ _id: id, user: req.user.id });
    if (!tour) {
      return res.json({
        status: false,
        message: "Tour not found or you don't have permission to edit it",
        data: null,
      });
    }

    tour.title = title || tour.title;
    tour.description = description || tour.description;
    tour.city = city || tour.city;
    tour.startDate = startDate || tour.startDate;
    tour.endDate = endDate || tour.endDate;
    tour.photos = photos || tour.photos;

    const updatedTour = await tour.save();
    return res.json({
      status: true,
      message: "Tour updated successfully",
      data: updatedTour,
    });
  } catch (error) {
    return res.json({
      status: false,
      message: error.message,
      data: null,
    });
  }
};

export {gettours, posttours, updatetours, getAllTours};