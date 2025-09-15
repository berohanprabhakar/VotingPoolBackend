const { prisma } = require("../dbconfig/prisma");

exports.castVote = async (req, res) => {
  try {
    const { userId, optionId } = req.body;
    const io = req.app.get("io");

    if (!userId || !optionId) {
      return res
        .status(400)
        .json({
          code: 400,
          error: true,
          message: "userId and optionId are required",
        });
    }

    const existingVote = await prisma.vote.findFirst({
      where: { userId, optionId },
    });

    if (existingVote) {
      return res
        .status(400)
        .json({
          code: 400,
          error: true,
          message: "User already voted for this option",
        });
    }

    const vote = await prisma.vote.create({
      data: {
        user: { connect: { id: userId } },
        option: { connect: { id: optionId } },
      },
      include: {
        option: {
          include: { poll: true },
        },
      },
    });

    const pollId = vote.option.pollId;

    // Fetch updated results
    const pollResults = await prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        options: {
          include: { votes: true },
        },
      },
    });

    const results = pollResults.options.map((opt) => ({
      id: opt.id,
      text: opt.text,
      votesCount: opt.votes.length,
    }));

    // Broadcast to all clients in this poll room
    io.to(`poll-${pollId}`).emit("voteUpdate", {
      pollId,
      results,
    });

    return res.status(201).json({
      code: 201,
      error: false,
      message: "Vote cast successfully",
      data: vote,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      error: true,
      message: "Something went wrong while casting vote",
    });
  }
};
