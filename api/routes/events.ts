import express from 'express';
import { events } from '../mock/data.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(events);
});

router.get('/:id', (req, res) => {
  const event = events.find(e => e.id === req.params.id);
  if (event) {
    res.json(event);
  } else {
    res.status(404).json({ message: '事件不存在' });
  }
});

router.post('/', (req, res) => {
  const newEvent = {
    id: `ev${String(events.length + 1).padStart(3, '0')}`,
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  events.push(newEvent);
  res.status(201).json(newEvent);
});

router.put('/:id', (req, res) => {
  const index = events.findIndex(e => e.id === req.params.id);
  if (index !== -1) {
    events[index] = {
      ...events[index],
      ...req.body,
    };
    res.json(events[index]);
  } else {
    res.status(404).json({ message: '事件不存在' });
  }
});

router.delete('/:id', (req, res) => {
  const index = events.findIndex(e => e.id === req.params.id);
  if (index !== -1) {
    events.splice(index, 1);
    res.json({ message: '删除成功' });
  } else {
    res.status(404).json({ message: '事件不存在' });
  }
});

export default router;
