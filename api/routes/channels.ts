import express from 'express';
import { channels } from '../mock/data.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(channels);
});

router.get('/:id', (req, res) => {
  const channel = channels.find(c => c.id === req.params.id);
  if (channel) {
    res.json(channel);
  } else {
    res.status(404).json({ message: '渠道不存在' });
  }
});

router.post('/', (req, res) => {
  const newChannel = {
    id: `ch${String(channels.length + 1).padStart(3, '0')}`,
    ...req.body,
  };
  channels.push(newChannel);
  res.status(201).json(newChannel);
});

router.put('/:id', (req, res) => {
  const index = channels.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    channels[index] = {
      ...channels[index],
      ...req.body,
    };
    res.json(channels[index]);
  } else {
    res.status(404).json({ message: '渠道不存在' });
  }
});

router.delete('/:id', (req, res) => {
  const index = channels.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    channels.splice(index, 1);
    res.json({ message: '删除成功' });
  } else {
    res.status(404).json({ message: '渠道不存在' });
  }
});

router.post('/:id/toggle', (req, res) => {
  const index = channels.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    const channel = channels[index];
    const newStatus = channel.status === 'active' ? 'inactive' : 'active';
    channels[index] = {
      ...channel,
      status: newStatus as 'active' | 'inactive',
    };
    res.json(channels[index]);
  } else {
    res.status(404).json({ message: '渠道不存在' });
  }
});

export default router;
