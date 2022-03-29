// Automatically looks for index.js and gets the Pizza model from there
const { Pizza } = require('../models');

const pizzaController = {
  /**-------------------------
   *    Get all pizzas
   *------------------------**/
  getAllPizza(req, res) {
    Pizza.find({})
      .populate({
        path: 'comments',
        select: '-__v',
      })
      // Removes __v field
      .select('-__v')
      // Sort pizza's by newest to oldest order
      .sort({ _id: -1 })
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
      .populate({
        path: 'comments',
        select: '-__v',
      })
      .select('-__v')
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
