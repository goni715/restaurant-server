import express from 'express';
import { UserRoutes } from '../modules/User/user.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { AdminRoutes } from '../modules/Admin/admin.route';
import { RestaurantRoutes } from '../modules/Restaurant/restaurant.route';
import { FavouriteRoutes } from '../modules/Favourite/favourite.route';
import { ReviewRoutes } from '../modules/Review/review.route';
import { NotificationRoutes } from '../modules/Notification/notification.route';
import { CuisineRoutes } from '../modules/Cuisine/cuisine.route';
import { DiningRoutes } from '../modules/Dining/dining.route';
import { SocialMediaRoutes } from '../modules/SocialMedia/socialMedia.route';
import { MenuRoutes } from '../modules/Menu/menu.route';
import { MenuReviewRoutes } from '../modules/MenuReview/menuReview.route';
import { ScheduleRoutes } from '../modules/Schedule/schedule.route';

const router = express.Router();


const moduleRoutes = [
    {
        path: '/auth',
        route: AuthRoutes
    },
    {
        path: '/user',
        route: UserRoutes
    },  
    {
        path: '/admin',
        route: AdminRoutes
    }, 
    {
        path: '/cuisine',
        route: CuisineRoutes
    },
    {
        path: '/dining',
        route: DiningRoutes
    },
    {
        path: '/social-media',
        route: SocialMediaRoutes
    },
    {
        path: '/restaurant',
        route: RestaurantRoutes
    },
    {
        path: '/menu',
        route: MenuRoutes
    },
    {
        path: '/favourite',
        route: FavouriteRoutes
    },
    {
        path: '/review',
        route: ReviewRoutes
    },  
    {
        path: '/menu-review',
        route: MenuReviewRoutes
    }, 
    {
        path: '/notification',
        route: NotificationRoutes
    },
    {
        path: '/schedule',
        route: ScheduleRoutes
    }   
]

moduleRoutes.forEach((item, i)=> router.use(item.path, item.route));

export default router;