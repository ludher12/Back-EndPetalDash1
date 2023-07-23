const OrdersController = require('../controllers/ordersController');
const passport = require('passport');

module.exports = (app) => {

    // GET -> OBTENER DATOS
    // POST -> ALMACENAR DATOS
    // PUT -> ACTUALIZAR DATOS
    // DELETE -> ELIMINAR DATOS


    app.get('/api/orders/findByStatus/:status',  passport.authenticate('jwt', { session: false }), OrdersController.findByStatus);

    app.post('/api/orders/create',  passport.authenticate('jwt', { session: false }), OrdersController.create);

    app.put('/api/orders/updateToDispatched',  passport.authenticate('jwt', { session: false }), OrdersController.updateToDispatched);

}