// src/services/proxy.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestLog } from '../entities/request-log.entity';
import { ConfigService } from '@nestjs/config';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { getRandomUserAgent } from '../utils/user-agents';

interface ProxyConfig {
  host: string;
  port: number;
  username: string;
  password: string;
}

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);
  private proxyPool: ProxyConfig[] = [];

  constructor(
    @InjectRepository(RequestLog)
    private requestLogRepo: Repository<RequestLog>,
    private configService: ConfigService,
  ) {
    this.initializeProxyPool();
  }

  private initializeProxyPool() {
    const proxyConfigs = this.configService.get<ProxyConfig[]>('PROXY_POOL');
    if (!proxyConfigs || proxyConfigs.length === 0) {
      throw new Error('No proxy configurations found');
    }
    this.proxyPool = proxyConfigs;
    this.logger.log(`Initialized proxy pool with ${proxyConfigs.length} proxies`);
  }

  getRandomProxy(): ProxyConfig {
    const randomIndex = Math.floor(Math.random() * this.proxyPool.length);
    return this.proxyPool[randomIndex];
  }

  getProxyRequestConfig(config: ProxyConfig) {
    const proxy = `http://${config.username}:${config.password}@${config.host}:${config.port}`;
    return {
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept': '*/*',
        'Connection': 'keep-alive'
      },
      httpsAgent: new HttpsProxyAgent(proxy)
    };
  }

  async logRequest(data: Partial<RequestLog>): Promise<RequestLog> {
    const log = this.requestLogRepo.create(data);
    return this.requestLogRepo.save(log);
  }
}

