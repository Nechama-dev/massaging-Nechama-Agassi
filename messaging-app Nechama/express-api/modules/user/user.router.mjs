import raw from "../../middleware/route.async.wrapper.mjs"
import express from "express"
import user_model from "./user.model.mjs"

const router = express.Router();

router.use(express.json())

router.post("/", raw(async (req, res) => {
     console.log(req.body, "create a user, req.body:");
     const user = await user_model.create(req.body);
     res.status(200).json(user);
}));


// GET ALL USERS
router.get( "/",raw(async (req, res) => {
    const users = await user_model.find()
    res.status(200).json(users);
  })
);

// GETS A SINGLE USER
router.get("/:id",raw(async (req, res) => {
    const user = await user_model.findById(req.params.id)

    if (!user) return res.status(404).json({ status: "No user found." });
    res.status(200).json(user);
  })
);

// DELETES A USER
router.delete("/:id",raw(async (req, res) => {
    const user = await user_model.findByIdAndRemove(req.params.id);
    res.status(200).json(user);
  })
);

export default router;
