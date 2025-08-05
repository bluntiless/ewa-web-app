// FORCE VERCEL DEPLOYMENT - Latest commit: 74fa239 - Fixed PortfolioCompilationService and added evidence status refresh
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ 
    message: 'FORCE VERCEL DEPLOYMENT - Latest commit: 74fa239',
    status: 'Fixed PortfolioCompilationService and added evidence status refresh',
    timestamp: new Date().toISOString()
  });
}
