const { Router } = require("express");
const ctrl = require("../controllers/cursosController");

const router = Router();

router.route("/").get(ctrl.list).post(ctrl.create);
router.route("/:id").get(ctrl.getOne).put(ctrl.replace).patch(ctrl.update).delete(ctrl.remove);

module.exports = router;
