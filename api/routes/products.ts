import express from 'express';
import { products } from '../mock/data.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(products);
});

router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: '产品不存在' });
  }
});

router.post('/', (req, res) => {
  const newProduct = {
    id: `pd${String(products.length + 1).padStart(3, '0')}`,
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

router.put('/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    products[index] = {
      ...products[index],
      ...req.body,
    };
    res.json(products[index]);
  } else {
    res.status(404).json({ message: '产品不存在' });
  }
});

router.delete('/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    products.splice(index, 1);
    res.json({ message: '删除成功' });
  } else {
    res.status(404).json({ message: '产品不存在' });
  }
});

export default router;