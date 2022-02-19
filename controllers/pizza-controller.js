// Automatically looks for index.js and gets the Pizza model from there
const { Pizza } = require('../models');

// The functions will go in here as methods
const pizzaController = {
  /**-------------------------
   *    Get all pizzas
   *------------------------**/
  getAllPizza(req, res) {
    Pizza.find({})
      .then((dbPizzaData) => {
        res.status(200).json({
          status: 'success',
          data: {
            pizzas: dbPizzaData,
          },
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: 'error',
          data: {
            message: err,
          },
        });
      });
  },

  /**-------------------------
   *    Get a single pizza
   *------------------------**/
  // Here we are de-structuring params out of req.params
  getPizzaById({ params }, res) {
    Pizza.findById(params.id)
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({
            status: 'fail',
            data: {
              message: 'No pizza found with that ID',
            },
          });
          return;
        }

        res.status(200).json({
          status: 'success',
          data: {
            pizza: dbPizzaData,
          },
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: 'error',
          data: {
            message: err,
          },
        });
      });
  },

  /**-------------------------
   *    Create pizza
   *------------------------**/
  createPizza({ body }, res) {
    Pizza.create(body)
      .then((dbPizzaData) => {
        res.status(201).json({
          status: 'success',
          data: {
            pizza: dbPizzaData,
          },
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: 'error',
          data: {
            message: err,
          },
        });
      });
  },

  /**-------------------------
   *    Update pizza
   *------------------------**/
  updatePizza(req, res) {
    const { params } = req;
    Pizza.findByIdAndUpdate(params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({
            status: 'fail',
            data: {
              message: 'No pizza found with that ID',
            },
          });
          return;
        }

        res.status(200).json({
          status: 'success',
          data: {
            pizza: dbPizzaData,
          },
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: 'error',
          data: {
            message: err,
          },
        });
      });
  },

  /**-------------------------
   *    Delete pizza
   *------------------------**/
  deletePizza({ params }, res) {
    Pizza.findByIdAndDelete(params.id)
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({
            status: 'fail',
            data: {
              message: 'No pizza found with that ID',
            },
          });
          return;
        }

        res.status(200).json({
          status: 'success',
          data: {
            data: null,
          },
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: 'error',
          data: {
            message: err,
          },
        });
      });
  },
};

module.exports = pizzaController;
