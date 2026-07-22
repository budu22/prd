import express from 'express';
import { analyticsData, dashboardStats, trendData } from '../mock/data.js';

const router = express.Router();

router.get('/strategy/:id', (req, res) => {
  const data = analyticsData.find(d => d.strategyId === req.params.id);
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ message: '策略分析数据不存在' });
  }
});

router.get('/compare', (req, res) => {
  res.json(analyticsData);
});

router.get('/report', (req, res) => {
  res.json({
    stats: dashboardStats,
    trend: trendData,
    detail: analyticsData,
  });
});

router.get('/stats', (req, res) => {
  res.json(dashboardStats);
});

router.get('/trend', (req, res) => {
  res.json(trendData);
});

export default router;
