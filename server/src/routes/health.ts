import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// @desc    Health check endpoint
// @route   GET /health
// @access  Public
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    services: {
      database: 'unknown',
      server: 'running'
    },
    memory: {
      used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
      total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100
    }
  };

  // Check database connection
  try {
    if (mongoose.connection.readyState === 1) {
      healthCheck.services.database = 'connected';
    } else {
      healthCheck.services.database = 'disconnected';
      healthCheck.status = 'WARNING';
    }
  } catch (error) {
    healthCheck.services.database = 'error';
    healthCheck.status = 'ERROR';
  }

  // Set appropriate status code
  const statusCode = healthCheck.status === 'OK' ? 200 : 
                    healthCheck.status === 'WARNING' ? 200 : 503;

  res.status(statusCode).json(healthCheck);
}));

// @desc    Detailed health check
// @route   GET /health/detailed
// @access  Public
router.get('/detailed', asyncHandler(async (req: Request, res: Response) => {
  const detailedHealth = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: {
      seconds: process.uptime(),
      readable: formatUptime(process.uptime())
    },
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    services: {
      database: await checkDatabaseHealth(),
      server: 'running'
    },
    memory: {
      used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
      total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
      external: Math.round((process.memoryUsage().external / 1024 / 1024) * 100) / 100,
      rss: Math.round((process.memoryUsage().rss / 1024 / 1024) * 100) / 100
    },
    cpu: process.cpuUsage(),
    loadAverage: process.platform !== 'win32' ? require('os').loadavg() : 'N/A (Windows)'
  };

  // Determine overall status
  if (detailedHealth.services.database === 'error') {
    detailedHealth.status = 'ERROR';
  } else if (detailedHealth.services.database === 'disconnected') {
    detailedHealth.status = 'WARNING';
  }

  const statusCode = detailedHealth.status === 'OK' ? 200 : 
                    detailedHealth.status === 'WARNING' ? 200 : 503;

  res.status(statusCode).json(detailedHealth);
}));

// Helper function to check database health
async function checkDatabaseHealth() {
  try {
    const state = mongoose.connection.readyState;
    
    switch (state) {
      case 0:
        return 'disconnected';
      case 1:
        // Test the connection with a simple query
        await mongoose.connection.db.admin().ping();
        return 'connected';
      case 2:
        return 'connecting';
      case 3:
        return 'disconnecting';
      default:
        return 'unknown';
    }
  } catch (error) {
    return 'error';
  }
}

// Helper function to format uptime
function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const secs = Math.floor(seconds % 60);

  return `${days}d ${hours}h ${minutes}m ${secs}s`;
}

export default router;