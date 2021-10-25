import { Router } from "express";
import { middleware as query } from "querymen";
import { middleware as body } from "bodymen";
import { token } from "../../services/passport";
import { create, index, show, update, destroy } from "./controller";
import { schema } from "./model";
export Data, { schema } from "./model";

const router = new Router();
const { type, meta, name, text_type } = schema.tree;

/**
 * @api {post} /data Create data
 * @apiName CreateData
 * @apiGroup Data
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam type Data's type.
 * @apiParam meta Data's meta.
 * @apiParam name Data's name.
 * @apiParam text_type Data's text_type.
 * @apiSuccess {Object} data Data's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Data not found.
 * @apiError 401 admin access only.
 */
router.post(
  "/",
  token({ required: true, roles: ["admin"] }),
  body({ type, meta, name, text_type }),
  create
);

/**
 * @api {get} /data Retrieve data
 * @apiName RetrieveData
 * @apiGroup Data
 * @apiUse listParams
 * @apiSuccess {Object[]} data List of data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/", query(), index);

/**
 * @api {get} /data/:id Retrieve data
 * @apiName RetrieveData
 * @apiGroup Data
 * @apiSuccess {Object} data Data's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Data not found.
 */
router.get("/:id", show);

/**
 * @api {put} /data/:id Update data
 * @apiName UpdateData
 * @apiGroup Data
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam type Data's type.
 * @apiParam meta Data's meta.
 * @apiParam name Data's name.
 * @apiParam text_type Data's text_type.
 * @apiSuccess {Object} data Data's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Data not found.
 * @apiError 401 admin access only.
 */
router.put(
  "/:id",
  token({ required: true, roles: ["admin"] }),
  body({ type, meta, name, text_type }),
  update
);

/**
 * @api {delete} /data/:id Delete data
 * @apiName DeleteData
 * @apiGroup Data
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Data not found.
 * @apiError 401 admin access only.
 */
router.delete("/:id", token({ required: true, roles: ["admin"] }), destroy);

export default router;
