import { Document, model, Schema, SchemaTypes } from "mongoose";
const collectionName = "User";

const roles = ["admin", "general"];

const schema = new Schema({
    name: { type: String, required: true, unique: true, cn: "名称" },
    phone: { type: String, required: true, unique: true, cn: "备注" },
    role: { type: SchemaTypes.ObjectId, ref: "Role", cn: "角色" },
    department: { type: SchemaTypes.ObjectId, ref: "Department", cn: "部门" },
    extranet: { type: Boolean, default: false, cn: "外网权限" },
    removed: { type: Boolean, default: false },
    merchant: { type: SchemaTypes.ObjectId, ref: "Merchant", cn: "商户" },
    password: { type: String, default: "111111" },
    remark: String,
}, { timestamps: true, toJSON: { virtuals: true } });

const UserModel = model<amb.IUser & Document>(collectionName, schema);

export {
    UserModel,
    roles,
};
