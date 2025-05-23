import config from "../config";
import UserModel from "../modules/User/user.model";


const superUser = {
    fullName: "Osama Osama",
    email: config.super_admin_email,
    phone: "01700000000",
    password: config.super_admin_password, 
    role: 'super_admin',
}


const seedSuperAdmin = async () => {
    //when databse is connected, we will check is there any user who is super admin
    const isSuperAdminExists = await UserModel.findOne({role: 'super_admin'});

    //check if there is no superAdmin
    if(!isSuperAdminExists){
        await UserModel.create(superUser);
        console.log("Super Admin Created");
    }
}


export default seedSuperAdmin;