import express from 'express';
import { strategies } from '../mock/data.js';
import { Strategy } from '../../src/types/index.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(strategies);
});

router.get('/:id', (req, res) => {
  const strategy = strategies.find(s => s.id === req.params.id);
  if (strategy) {
    res.json(strategy);
  } else {
    res.status(404).json({ message: '策略不存在' });
  }
});

router.post('/', (req, res) => {
  const newStrategy = {
    id: `st${String(strategies.length + 1).padStart(3, '0')}`,
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  strategies.push(newStrategy);
  res.status(201).json(newStrategy);
});

router.put('/:id', (req, res) => {
  const index = strategies.findIndex(s => s.id === req.params.id);
  if (index !== -1) {
    strategies[index] = {
      ...strategies[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    res.json(strategies[index]);
  } else {
    res.status(404).json({ message: '策略不存在' });
  }
});

router.delete('/:id', (req, res) => {
  const index = strategies.findIndex(s => s.id === req.params.id);
  if (index !== -1) {
    strategies.splice(index, 1);
    res.json({ message: '删除成功' });
  } else {
    res.status(404).json({ message: '策略不存在' });
  }
});

router.post('/:id/publish', (req, res) => {
  const index = strategies.findIndex(s => s.id === req.params.id);
  if (index !== -1) {
    const strategy = strategies[index];
    strategies[index] = {
      ...strategy,
      status: 'active' as const,
      updatedAt: new Date().toISOString(),
    } as Strategy;
    res.json(strategies[index]);
  } else {
    res.status(404).json({ message: '策略不存在' });
  }
});

router.post('/:id/pause', (req, res) => {
  const index = strategies.findIndex(s => s.id === req.params.id);
  if (index !== -1) {
    const strategy = strategies[index];
    strategies[index] = {
      ...strategy,
      status: 'paused' as const,
      updatedAt: new Date().toISOString(),
    } as Strategy;
    res.json(strategies[index]);
  } else {
    res.status(404).json({ message: '策略不存在' });
  }
});

export default router;
