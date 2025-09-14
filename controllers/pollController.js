const { prisma } = require("../dbconfig/prisma");

exports.createPoll = async (req, res) => {
  try {
    const { question, options, userId } = req.body;

    if (!question || !options || options.length < 2) {
      return res.json({
        code: 400,
        error: true,
        message: "Poll must have a question and at least 2 options",
      });
    }

    const poll = await prisma.poll.create({
      data: {
        question,
        isPublished: true,
        creator: { connect: { id: userId } },
        options: {
          create: options.map((text) => ({ text })),
        },
      },
      include: { options: true, creator: true },
    });

    return res.json({
      code: 201,
      error: false,
      message: "Poll created successfully",
      data: poll,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      code: 500,
      error: true,
      message: "Something went wrong while creating poll",
    });
  }
};

exports.getPolls = async (req, res) => {
  try {
    const polls = await prisma.poll.findMany({
      include: {
        options: true,
        creator: { select: { id: true, name: true, email: true } },
      },
    });

    return res.json({
      code: 200,
      error: false,
      message: "Polls fetched successfully",
      data: polls,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      error: true,
      message: "Something went wrong while fetching polls",
    });
  }
};

exports.getPollById = async (req, res) => {
  try {
    const { id } = req.params;

    const poll = await prisma.poll.findUnique({
      where: { id: Number(id) },
      include: {
        options: {
          include: {
            votes: true, // to count votes
          },
        },
        creator: { select: { id: true, name: true } },
      },
    });

    if (!poll) {
      return res.status(404).json({
        code: 404,
        error: true,
        message: "Poll not found",
      });
    }

    // attach counts
    const pollWithCounts = {
      ...poll,
      options: poll.options.map((opt) => ({
        id: opt.id,
        text: opt.text,
        votesCount: opt.votes.length,
      })),
    };

    return res.json({
      code: 200,
      error: false,
      message: "Poll fetched successfully",
      data: pollWithCounts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      error: true,
      message: "Something went wrong while fetching poll",
    });
  }
};

