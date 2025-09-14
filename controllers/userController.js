const { prisma } = require("../dbconfig/prisma");
const bcrypt = require("bcrypt");

exports.getUsers = async (req, res) => {
  try {
    const { id } = req.params;
    if (id && !isNaN(id)) {
      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
        select: { name: true, email: true },
      });

      if (!user) {
        return res.json({
          code: 404,
          error: true,
          message: "No user found!",
          data: [],
        });
      }

      return res.json({
        code: 200,
        error: false,
        message: "Successfully found user",
        data: user,
      });
    }

    const allUsers = await prisma.user.findMany({
      select: { id: true, name: true, email: true },
    });

    return res.json({
      code: 200,
      error: false,
      message: "Successfully found users",
      data: allUsers,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      code: 500,
      error: true,
      message: "Something went wrong!",
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({
        code: 400,
        error: true,
        message: "Bad request",
      });
    }

    // generate salt and hash
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
      },
    });

    return res.json({
      code: 201,
      error: false,
      message: "User registered successfully",
      data: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    return res.json({
      code: 500,
      error: true,
      message: "Something went wrong!",
    });
  }
};
