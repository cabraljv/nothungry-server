import { Router } from 'express';
import Multer from 'multer';

import AdditionsController from './controllers/AdditionsController';
import DashboardController from './controllers/DashboardController';
import OrderAcceptController from './controllers/OrderAcceptController';
import OrderController from './controllers/OrderController';
import OrderDenyController from './controllers/OrderDenyController';
import OrderFinishController from './controllers/OrderFinishController';
import ProductController from './controllers/ProductController';
import RestaurantController from './controllers/RestaurantController';
import SessionController from './controllers/SessionController';
import auth from './middlewares/auth';

const uploads = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
const routes = Router();

routes.get('/', (req, res) => res.send('Server ok'));

routes.post('/restaurant', uploads.single('image'), RestaurantController.store);
routes.get('/restaurant/:id', RestaurantController.show);
routes.post('/order/create', OrderController.forceCreate);

routes.post('/order', OrderController.store);
routes.get('/order/:id', OrderController.show);

routes.post('/session', SessionController.store);
routes.use(auth);
routes.put('/order/accept/:orderId', OrderAcceptController.store);
routes.put('/order/deny/:orderId', OrderDenyController.store);
routes.put('/order/finish/:orderId', OrderFinishController.store);
routes.get('/order', OrderController.index);

routes.post('/additions', AdditionsController.store);
routes.get('/additions', AdditionsController.index);

routes.post('/product', uploads.single('image'), ProductController.store);
routes.put('/product', uploads.single('image'), ProductController.update);
routes.get('/product', ProductController.index);
routes.delete('/product/:id', ProductController.destroy);

routes.get('/dashboard', DashboardController.index);
export default routes;
