var express = require('express');
var router = express.Router();
let inventorySchema = require('../schemas/inventory');

router.get('/', async function (req, res, next) {
  try {
    let result = await inventorySchema.find().populate('product');
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    let result = await inventorySchema.findById(req.params.id).populate('product');

    if (result) {
      res.status(200).send(result);
    } else {
      res.status(404).send({
        message: 'INVENTORY ID NOT FOUND'
      });
    }
  } catch (error) {
    res.status(404).send({
      message: 'INVENTORY ID NOT FOUND'
    });
  }
});

router.post('/add-stock', async function (req, res, next) {
  try {
    let { product, quantity } = req.body;

    if (!product || !quantity || quantity <= 0) {
      return res.status(400).send({
        message: 'product và quantity phải hợp lệ'
      });
    }

    let inventory = await inventorySchema.findOne({ product: product });

    if (!inventory) {
      return res.status(404).send({
        message: 'KHÔNG TÌM THẤY INVENTORY CỦA PRODUCT'
      });
    }

    inventory.stock += Number(quantity);
    await inventory.save();

    res.status(200).send({
      message: 'ADD STOCK SUCCESS',
      data: inventory
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/remove-stock', async function (req, res, next) {
  try {
    let { product, quantity } = req.body;

    if (!product || !quantity || quantity <= 0) {
      return res.status(400).send({
        message: 'product và quantity phải hợp lệ'
      });
    }

    let inventory = await inventorySchema.findOne({ product: product });

    if (!inventory) {
      return res.status(404).send({
        message: 'KHÔNG TÌM THẤY INVENTORY CỦA PRODUCT'
      });
    }

    if (inventory.stock < Number(quantity)) {
      return res.status(400).send({
        message: 'STOCK KHÔNG ĐỦ ĐỂ GIẢM'
      });
    }

    inventory.stock -= Number(quantity);
    await inventory.save();

    res.status(200).send({
      message: 'REMOVE STOCK SUCCESS',
      data: inventory
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/reservation', async function (req, res, next) {
  try {
    let { product, quantity } = req.body;

    if (!product || !quantity || quantity <= 0) {
      return res.status(400).send({
        message: 'product và quantity phải hợp lệ'
      });
    }

    let inventory = await inventorySchema.findOne({ product: product });

    if (!inventory) {
      return res.status(404).send({
        message: 'KHÔNG TÌM THẤY INVENTORY CỦA PRODUCT'
      });
    }

    if (inventory.stock < Number(quantity)) {
      return res.status(400).send({
        message: 'STOCK KHÔNG ĐỦ ĐỂ RESERVATION'
      });
    }

    inventory.stock -= Number(quantity);
    inventory.reserved += Number(quantity);
    await inventory.save();

    res.status(200).send({
      message: 'RESERVATION SUCCESS',
      data: inventory
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/sold', async function (req, res, next) {
  try {
    let { product, quantity } = req.body;

    if (!product || !quantity || quantity <= 0) {
      return res.status(400).send({
        message: 'product và quantity phải hợp lệ'
      });
    }

    let inventory = await inventorySchema.findOne({ product: product });

    if (!inventory) {
      return res.status(404).send({
        message: 'KHÔNG TÌM THẤY INVENTORY CỦA PRODUCT'
      });
    }

    if (inventory.reserved < Number(quantity)) {
      return res.status(400).send({
        message: 'RESERVED KHÔNG ĐỦ ĐỂ SOLD'
      });
    }

    inventory.reserved -= Number(quantity);
    inventory.soldCount += Number(quantity);
    await inventory.save();

    res.status(200).send({
      message: 'SOLD SUCCESS',
      data: inventory
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;