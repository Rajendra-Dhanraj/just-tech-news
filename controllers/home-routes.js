// This file will contain all of the user-facing routes, such as the homepage and login page.

const router = require("express").Router();
const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../models");

router.get("/", (req, res) => {
  Post.findAll({
    attributes: [
      "id",
      "post_url",
      "title",
      "created_at",
      [
        sequelize.literal(
          "(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)"
        ),
        "vote_count",
      ],
    ],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      // pass a single post object int the homepage template
      console.log(dbPostData[0]);
      const posts = dbPostData.map((post) => post.get({ plain: true })); // This will loop over and map each Sequelize object into a serialized version of itself, saving the results in a new posts array.

      res.render("homepage", { posts });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
