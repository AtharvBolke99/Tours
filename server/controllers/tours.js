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

export {gettours, posttours};