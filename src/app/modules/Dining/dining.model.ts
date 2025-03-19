import { model, Schema } from "mongoose";
import { IDining } from "./dining.interface";


const diningSchema = new Schema<IDining>({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
},{
    timestamps: true,
    versionKey: false
})



const DiningModel = model<IDining>("Dining", diningSchema);
export default DiningModel;