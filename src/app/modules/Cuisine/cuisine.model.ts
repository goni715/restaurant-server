import { model, Schema } from "mongoose";
import { ICuisine } from "./cuisine.interface";


const cuisineSchema = new Schema<ICuisine>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }
})



const CuisineModel = model("Cuisine", cuisineSchema);
export default CuisineModel