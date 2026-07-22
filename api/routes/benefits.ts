import express from 'express';
import { benefits } from '../mock/data.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(benefits);
});

router.get('/:id', (req, res) => {
  const benefit = benefits.find(b => b.id === req.params.id);
  if (benefit) {
    res.json(benefit);
  } else {
    res.status(404).json({ message: '权益不存在' });
  }
});

router.post('/', (req, res) => {
  const newBenefit = {
    id: `bf${String(benefits.length + 1).padStart(3, '0')}`,
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  benefits.push(newBenefit);
  res.status(201).json(newBenefit);
});

router.put('/:id', (req, res) => {
  const index = benefits.findIndex(b => b.id === req.params.id);
  if (index !== -1) {
    benefits[index] = {
      ...benefits[index],
      ...req.body,
    };
    res.json(benefits[index]);
  } else {
    res.status(404).json({ message: '权益不存在' });
  }
});

router.delete('/:id', (req, res) => {
  const index = benefits.findIndex(b => b.id === req.params.id);
  if (index !== -1) {
    benefits.splice(index, 1);
    res.json({ message: '删除成功' });
  } else {
    res.status(404).json({ message: '权益不存在' });
  }
});

export default router;