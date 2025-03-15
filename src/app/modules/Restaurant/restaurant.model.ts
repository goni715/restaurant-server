import { model, Schema } from "mongoose";
import { IRestaurant } from "./restaurant.interface";


const restaurantSchema = new Schema<IRestaurant>({
    ownerId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    cuisine: {
        type: String,
        required:true,
        trim: true
    },
    website: {
        type: String,
        required:true,
        trim: true
    },
    location: {
        type: String,
        required:true,
        trim: true
    },
    keywords: {
        type: [String],
        default: []
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    featured: {
        type: String,
        trim: true
    },
},{
    timestamps: true,
    versionKey: false
})


const RestaurantModel = model<IRestaurant>('Restaurant', restaurantSchema);
export default RestaurantModel;