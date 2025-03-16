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
    dining: {
        type: String,
        required:true,
        trim: true
    },
    website: {
        type: String,
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
    features: {
        type: [String],
        default: []
    },
    discount: {
        type: String,
        trim: true
    },
    ratings: {
        type: Number,
        trim: true,
        default: 0,
    },
    status: {
        type: String,
        enum: ["active", "deactive"],
        default: 'active'
    },
    approved: {
        type: String,
        enum: ["pending", "accepted", "cancelled"],
        default: 'pending'
    }
},{
    timestamps: true,
    versionKey: false
})


const RestaurantModel = model<IRestaurant>('Restaurant', restaurantSchema);
export default RestaurantModel;