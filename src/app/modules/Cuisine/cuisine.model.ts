import { model, Schema } from "mongoose";
import { ICuisine } from "./cuisine.interface";


const cuisineSchema = new Schema<ICuisine>({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    image: {
        type: String,
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



const CuisineModel = model<ICuisine>("Cuisine", cuisineSchema);
export default CuisineModel