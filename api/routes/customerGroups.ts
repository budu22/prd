import express from 'express';
import { customerGroups } from '../mock/data.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(customerGroups);
});

router.get('/:id', (req, res) => {
  const group = customerGroups.find(g => g.id === req.params.id);
  if (group) {
    res.json(group);
  } else {
    res.status(404).json({ message: '客群不存在' });
  }
});

router.post('/', (req, res) => {
  const newGroup = {
    id: `cg${String(customerGroups.length + 1).padStart(3, '0')}`,
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  customerGroups.push(newGroup);
  res.status(201).json(newGroup);
});

router.put('/:id', (req, res) => {
  const index = customerGroups.findIndex(g => g.id === req.params.id);
  if (index !== -1) {
    customerGroups[index] = {
      ...customerGroups[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    res.json(customerGroups[index]);
  } else {
    res.status(404).json({ message: '客群不存在' });
  }
});

router.delete('/:id', (req, res) => {
  const index = customerGroups.findIndex(g => g.id === req.params.id);
  if (index !== -1) {
    customerGroups.splice(index, 1);
    res.json({ message: '删除成功' });
  } else {
    res.status(404).json({ message: '客群不存在' });
  }
});

export default router;
