import { model, Schema } from "mongoose";
import { ISocialMedia } from "./socialMedia.interface";


const socialMediaSchema = new Schema<ISocialMedia>({
    website: {
        type: String,
        trim: true
    },
    facebook: {
        type: String,
        trim: true
    },
    youtube: {
        type: String,
        trim: true
    },
    instagram: {
        type: String,
        trim: true
    },
    other: {
        type: String,
        trim: true
    },
},{
    timestamps: true,
    versionKey: false
})



const SocialMediaModel = model<ISocialMedia>("SocialMedia", socialMediaSchema);
export default SocialMediaModel;