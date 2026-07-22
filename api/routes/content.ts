import express from 'express';
import { contents } from '../mock/data.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(contents);
});

router.get('/:id', (req, res) => {
  const content = contents.find(c => c.id === req.params.id);
  if (content) {
    res.json(content);
  } else {
    res.status(404).json({ message: '内容不存在' });
  }
});

router.post('/', (req, res) => {
  const newContent = {
    id: `ct${String(contents.length + 1).padStart(3, '0')}`,
    ...req.body,
    version: '1.0',
    createdAt: new Date().toISOString(),
  };
  contents.push(newContent);
  res.status(201).json(newContent);
});

router.put('/:id', (req, res) => {
  const index = contents.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    contents[index] = {
      ...contents[index],
      ...req.body,
    };
    res.json(contents[index]);
  } else {
    res.status(404).json({ message: '内容不存在' });
  }
});

router.delete('/:id', (req, res) => {
  const index = contents.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    contents.splice(index, 1);
    res.json({ message: '删除成功' });
  } else {
    res.status(404).json({ message: '内容不存在' });
  }
});

export default router;