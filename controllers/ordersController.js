const Order = require('../models/order');
const OrderHasProducts = require('../models/order_has_products');
const User = require('../models/user');

module.exports = {

    findByStatus(req, res) {
        const status = req.params.status;

        Order.findByStatus(status, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar las ordenes',
                    error: err
                });
            }

            for (const d of data) {
                d.address = JSON.parse(d.address);
                d.client = JSON.parse(d.client);
                d.delivery = JSON.parse(d.delivery);
                d.products = JSON.parse(d.products);
            }
            
            
            return res.status(201).json(data);
        });
    },

    async create(req, res) {

        const order = req.body;

        Order.create(order, async (err, id) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de crear la orden',
                    error: err
                });
            }

            for (const product of order.products) {
                await OrderHasProducts.create(id, product.id, product.quantity, (err, id_data) => {
                    if (err) {
                        return res.status(501).json({
                            success: false,
                            message: 'Hubo un error con la creacion de los productos en la orden',
                            error: err
                        });
                    }
                });
            }

            return res.status(201).json({
                success: true,
                message: 'La orden se ha creado correctamente',
                data: `${id}` // EL ID DE LA NUEVA CATEGORIA
            });

        });

    },

    updateToDispatched(req, res) {
        const order = req.body;

        Order.updateToDispatched(order.id, order.id_delivery, (err, id_order) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de actualizar la orden',
                    error: err
                });
            }

            /*
            User.findById(order.id_delivery, (err, user) => {
                
                if (user !== undefined && user !== null) {

                    console.log('NOTIFICATION TOKEN', user.notification_token);
                    PushNotificationsController.sendNotification(user.notification_token, {
                        title: 'PEDIDO ASIGNADO',
                        body: 'Te han asignado un pedido para entregar',
                        id_notification: '1'
                    });
                }

            });*/
            
            return res.status(201).json({
                success: true,
                message: 'La orden se ha actualizado correctamente',
                data: `${id_order}` // EL ID 
            });

        });
    },

    findByDeliveryAndStatus(req, res) {
        const id_delivery = req.params.id_delivery;
        const status = req.params.status;

        Order.findByDeliveryAndStatus(id_delivery, status, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar las ordenes',
                    error: err
                });
            }

            for (const d of data) {
                d.address = JSON.parse(d.address);
                d.client = JSON.parse(d.client);
                d.delivery = JSON.parse(d.delivery);
                d.products = JSON.parse(d.products);
            }
            
            
            return res.status(201).json(data);
        });
    },

    updateToOnTheWay(req, res) {
        const order = req.body;


        Order.updateToOnTheWay(order.id, (err, id_order) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de actualizar la orden',
                    error: err
                });
            }

            User.findById(order.id_delivery, (err, user) => {
                
                var botId = '107164202464909';
                var phoneNbr = '52'+user.phone;
                var bearerToken = 'EAAJhyk7dXrUBO3V0C2ZBu9BfoWSTtF8y41M3hWzHeuastIFVRujQfCnTs4KIDDZCZCfXjHUOTwliOqxk8WIBJgaOllZBK3ZAukZBERfFg9IHIIio4xZCAbUfV3CGdk6xut92UWwUXn3eENjIurU2R1oChZCBEVMgmmESlZBwmaYWMsZCqf4ikuxOsNUFHtfUctBgVsb8fRZBopUR3fAI0QZD';

                var url = 'https://graph.facebook.com/v17.0/' + botId + '/messages';
                var data2 = {
                messaging_product: 'whatsapp',
                to: phoneNbr,
                type: 'template',
                template: {
                name:'hello_world',
                language:{ code: 'en_US' }  
                  }
                };

                var postReq = {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + bearerToken,
                    'Content-Type': 'application/json'
                    },
                body: JSON.stringify(data2),
                json: true
                };

                fetch(url, postReq)
                .then(data2 => {
                return data2.json()
                })
                .then(res => {
                console.log(res)
                })
                .catch(error => console.log(error));

            });

            return res.status(201).json({
                success: true,
                message: 'La orden se ha actualizado correctamente',
                data: `${id_order}` // EL ID 
            });

        });
    },

    updateLatLng(req, res) {
        const order = req.body;

        Order.updateLatLng(order, (err, id_order) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de actualizar la orden',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'La orden se ha actualizado correctamente',
                data: `${id_order}` // EL ID 
            });

        });
    },
    
    


}
