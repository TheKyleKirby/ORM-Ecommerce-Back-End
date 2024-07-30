const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// ? The `/api/tags` endpoints.

// *GET all tags.
router.get("/", async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: [{ model: Product, through: ProductTag }],
    });
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json(err);
  }
});

// *GET a single tag by id.
router.get("/:id", async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag }],
    });
    if (!tag) {
      res.status(404).json({ message: "No tag found with this id" });
      return;
    }
    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json(err);
  }
});

// *POST a new tag.
router.post("/", async (req, res) => {
  try {
    const tag = await Tag.create(req.body);
    res.status(201).json(tag);
  } catch (err) {
    res.status(400).json(err);
  }
});

// *PUT update a tag by id.
router.put("/:id", async (req, res) => {
  try {
    const [rowsUpdated, [updatedTag]] = await Tag.update(req.body, {
      returning: true,
      where: {
        id: req.params.id,
      },
    });
    if (rowsUpdated === 0) {
      res.status(404).json({ message: "No tag found with this id" });
      return;
    }
    res.status(200).json(updatedTag);
  } catch (err) {
    res.status(400).json(err);
  }
});

// *DELETE a tag by id.
router.delete("/:id", async (req, res) => {
  try {
    const rowsDeleted = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (rowsDeleted === 0) {
      res.status(404).json({ message: "No tag found with this id" });
      return;
    }
    res.status(204).end();
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;