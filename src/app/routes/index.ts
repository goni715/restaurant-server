import express from 'express';
import { UserRoutes } from '../modules/User/user.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
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
import { BookingRoutes } from '../modules/Booking/booking.route';
import { SlotRoutes } from '../modules/Slot/slot.route';
import { AdministratorRoutes } from '../modules/Administrator/administrator.route';
import { TableRoutes } from '../modules/Table/table.route';
import { TableBookingRoutes } from '../modules/TableBooking/tableBooking.route';
import OwnerRoutes from '../modules/Owner/Owner.route';
import FaqRoutes from '../modules/Faq/Faq.route';
import PolicyRoutes from '../modules/Policy/Policy.route';

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
        path: '/owner',
        route: OwnerRoutes
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
    },
    {
        path: '/booking',
        route: BookingRoutes
    },
    {
        path: '/slot',
        route: SlotRoutes
    },
    {
        path: '/administrator',
        route: AdministratorRoutes
    },
    {
        path: '/table',
        route: TableRoutes
    },
    {
        path: '/table-booking',
        route: TableBookingRoutes
    },
    {
        path: '/faq',
        route: FaqRoutes
    },
    {
        path: '/policy',
        route: PolicyRoutes
    }    
]

moduleRoutes.forEach((item, i)=> router.use(item.path, item.route));

export default router;