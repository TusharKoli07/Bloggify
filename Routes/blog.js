const { Router } = require("express");
const multer = require("multer");
const path = require("path");

const router = Router();

const Blog = require("../Models/blog");
const Comment = require("../Models/comments");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../Public/uploads"));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: res.user,
  });
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy"
  );
  //  console.log("blog",blog);
  // console.log("Image URL:", blog.createdBy.profileImageURL);
  console.log("comments",comments);

  return res.render("BlogPage", {
    user: req.user,
    blog,
    comments,
  });
});

router.post("/comments/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});

router.post("/", upload.single("CoverImage"), async (req, res) => {
  console.log(req.body);
  console.log(req.file);

  const { title, BlogBody } = req.body;

  const blog = await Blog.create({
    body: BlogBody,
    title,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`,
  });
  console.log("Error");
  return res.redirect(`/blog/${blog._id}`);
});

module.exports = router;
