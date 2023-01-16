const router = require("express").Router();
const BlogPost = require("../models/BlogPost");
const authentication = require("../middleware/authentication");

router.post("/", authentication, async (req, res) => {
  const { title, content, image } = req.body;
  console.log(req.body);
  try {
    const article = await BlogPost.create({
      title,
      content,
      image,
      creator: req.user._id,
    });
    console.log(article._id);
    req.user.articles.push(article._id);
    await req.user.save();
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

//GET
router.get("/", async (req, res) => {
  try {
    const posts = await BlogPost.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(404).json(error.message);
  }
});

//getting user's specific  all posts
router.get("/me", authentication, async (req, res) => {
  try {
    const user = req.user;
    console.log(user);
    user.populate("articles").then(({ articles }) => {
      res.status(200).json(articles);
    });
  } catch (error) {
    res.status(404).json(error);
  }
});

//GET Single article using id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const article = await BlogPost.findById(id);
    article.populate("creator").then((result) => res.json(result));
  } catch (error) {
    res.status(404).json(error.message);
  }
});

//Delete
router.delete("/:id", authentication, async (req, res) => {
  const { id } = req.params;
  try {
    const article = await BlogPost.findById(id);
    if (article.creator.toString() === req.user._id.toString()) {
      await article.remove();
      res.status(200).send();
    } else {
      res.status(401).send("You Dont have The Permission To Delete");
    }
  } catch (error) {
    res.status(400).send(e.message);
  }
});

//Patch for update
router.patch("/:id", authentication, async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const article = await BlogPost.findByIdAndUpdate(id, { title, content });
    res.status(200).send();
  } catch (error) {
    res.status(400).send();
  }
});

module.exports = router;
