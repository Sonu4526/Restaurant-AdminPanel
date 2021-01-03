const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../models");
const forgetPasswordEmail = require("../utils/mails")
const otpGenerator = require('otp-generator')

router.post("/create", (req, res) => {
  db.users
    .findOne({
      where: {
        email: req.body.email,
      },
    })
    .then(async (response) => {
      // if user found
      if (response) {
        res.json({
          message: "Oops, looks like there is already a user with that email.",
        });
      } else {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const hashedUser = { ...req.body, password: hashedPassword };
        db.users.create(hashedUser).then((user) => {
          const { id, name, email, restaurant, phone } = user.dataValues;
          res.json({ id, name, email, restaurant, phone });
        });
      }
    });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.users
    .findOne({
      where: {
        email: email,
      },
    })
    .then(async (response) => {
      // if no email found
      if (!response) {
        res.json({ message: "Sorry, no account found with that email." });
      } else {
        const { dataValues: data } = response;
        if (await bcrypt.compare(password, data.password)) {
          res.json({
            id: data.id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            restaurant: data.restaurant,
          });
        } else {
          res.json({ message: "Incorrect Password" });
        }
      }
    });
});

//edit user information
router.patch("/:id", (req, res) => {
  const { id } = req.params;
  db.users
    .update(req.body, {
      where: {
        id: id,
      },
      returning: true,
      plain: true,
    })
    .then((response) => {
      db.users
        .findOne({
          where: {
            id: id,
          },
          attributes: ["id", "name", "email", "restaurant", "phone"],
          raw: true,
        })
        .then((user) => {
          res.json(user);
        });
    });
});


router.get("/restaurantName", (req, res) => {
    db.findAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving customers."
        });
      else res.send(data);
    });
})


// get all menu Ctegories List
router.get("/:userId", (req, res) => {
  const { userId } = req.params;
  db.menuItems
    .findAll({
      where: {
        userId: userId,
      },
      raw: true,
      group: [["category"]],
    })
    .then((response) => {
      res.json(response);
    });
});

router.post("/change-password", (req, res) => {
    const user = req.body;
    console.log(user)
    db.users
    .findOne({
      where: {
        id: user.user_id,
      },
    })
    .then(async (response) => {
      if (!response) {
        res.json({
          message: "User not found",
        });
      } else {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(user.new_password, salt);
        db.users.update({password: hashedPassword},{where : {id:user.user_id}}).then((user) => {
          if(user) {
            res.json({
              message: "Password updated succesfully."
            });
          } else{
            res.json({
              message: "faild to update password."
            });
          }
        });
      }
    });
});

router.post("/forget-password", (req, res) => {
  const user = req.body;
  db.users.findOne({
    where: {
      email: user.email
    },
  })
  .then(async (response) => {
    if (!response) {
      res.json({
        message: "User not found",
      });
    } else {
      response.otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
      await forgetPasswordEmail.forgetPasswordEmail(response)
      db.users.update({otp: response.otp},{where : {id: response.id}}).then((user) => {
        if(user) {
          res.json({
            message: "Email sent succesfully."
          });
        } else {
          res.json({
            message: "Failed to send mail."
          });
        }
      });
    }
  });
});

router.post("/verify-otp", (req, res) => {
  const user = req.body;
  db.users.findOne({
    where: {
      email: user.email
    },
  })
  .then(async (response) => {
    if (!response) {
      res.json({
        message: "User not found",
      });
    } else {
        if(response.otp === user.otp) {
          res.json({
            success: true
          })
        } else {
          res.json({
            success: false
          })
        }
      }
  });
});
module.exports = router;
