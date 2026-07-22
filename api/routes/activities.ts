import express from 'express';
import { activities } from '../mock/data.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(activities);
});

router.get('/:id', (req, res) => {
  const activity = activities.find(a => a.id === req.params.id);
  if (activity) {
    res.json(activity);
  } else {
    res.status(404).json({ message: '活动不存在' });
  }
});

router.post('/', (req, res) => {
  const newActivity = {
    id: `ac${String(activities.length + 1).padStart(3, '0')}`,
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  activities.push(newActivity);
  res.status(201).json(newActivity);
});

router.put('/:id', (req, res) => {
  const index = activities.findIndex(a => a.id === req.params.id);
  if (index !== -1) {
    activities[index] = {
      ...activities[index],
      ...req.body,
    };
    res.json(activities[index]);
  } else {
    res.status(404).json({ message: '活动不存在' });
  }
});

router.delete('/:id', (req, res) => {
  const index = activities.findIndex(a => a.id === req.params.id);
  if (index !== -1) {
    activities.splice(index, 1);
    res.json({ message: '删除成功' });
  } else {
    res.status(404).json({ message: '活动不存在' });
  }
});

export default router;