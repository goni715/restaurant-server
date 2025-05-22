import { model, Schema } from "mongoose";
import { IRestaurant } from "./restaurant.interface";


const restaurantSchema = new Schema<IRestaurant>({
    ownerId: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'User'
    },
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
    },
    features: {
        type: [String],
        required:true
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
    restaurantImg: { 
        type: String,
        default: ''
    },
    location: {
        type: {
          type: String,
          enum: ['Point'], // 'type' must be "Point"
          required: true,
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: true,
        },
    },
    address: {
        type: String,
        required: [true, "Address is required"],
        trim: true
    },
    paymentRequired: {
        type: Boolean,
        default:false
    },
    bookingFeePerGuest: {//percentage
        type: Number,
        default: 0 
    },
    cancellationPercentage: {//percentage
        type: Number,
        default: 0 
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