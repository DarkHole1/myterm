import { getModelForClass, prop } from "@typegoose/typegoose";

class Role {
    @prop()
    public name: string
}

const RoleModel = getModelForClass(Role)

export default RoleModel