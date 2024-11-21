// scripts/generate-report.ts
import { createConnection } from 'typeorm';
import { RequestLog } from '../entities/request-log.entity';

async function generateReport() {
  const connection = await createConnection();
  const requestLogRepo = connection.getRepository(RequestLog);

  // Tổng quan
  const totalRequests = await requestLogRepo.count();
  const failedRequests = await requestLogRepo.count({ where: { status: Not(200) } });
  const avgResponseTime = await requestLogRepo
    .createQueryBuilder('log')
    .select('AVG(log.responseTime)', 'avg')
    .getRawOne();

  // Phân tích lỗi
  const errorAnalysis = await requestLogRepo
    .createQueryBuilder('log')
    .select(['log.errorMessage', 'COUNT(*) as count'])
    .where('log.status != 200')
    .groupBy('log.errorMessage')
    .getRawMany();

  // Proxy performance
  const proxyPerformance = await requestLogRepo
    .createQueryBuilder('log')
    .select([
      'log.proxyInstance',
      'COUNT(*) as total_requests',
      'COUNT(CASE WHEN log.status = 200 THEN 1 END) as successful_requests',
      'AVG(log.responseTime) as avg_response_time'
    ])
    .groupBy('log.proxyInstance')
    .getRawMany();
  // Generate report
  const report = {
    timestamp: new Date(),
    summary: {
      totalRequests,
      successRate: ((totalRequests - failedRequests) / totalRequests) * 100,
      avgResponseTime: avgResponseTime.avg
    },
    errorAnalysis,
    proxyPerformance
  };
  // Save report
  console.log(JSON.stringify(report, null, 2));
  await connection.close();
}
generateReport().catch(console.error);