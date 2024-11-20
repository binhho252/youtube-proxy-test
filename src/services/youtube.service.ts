import { Injectable, Logger } from '@nestjs/common';
import { ProxyService } from './proxy.service';
import * as ytdl from 'ytdl-core';

@Injectable()
export class YoutubeService {
  private readonly logger = new Logger(YoutubeService.name);

  constructor(private proxyService: ProxyService) {}

  async getVideoInfo(videoUrl: string) {
    const proxyConfig = this.proxyService.getRandomProxy();
    const startTime = Date.now();
    
    try {
      const info = await ytdl.getBasicInfo(videoUrl, {
        requestOptions: this.proxyService.getProxyRequestConfig(proxyConfig)
      });
      
      await this.proxyService.logRequest({
        videoUrl,
        proxyInstance: proxyConfig.host,
        status: 200,
        responseTime: Date.now() - startTime,
        proxyConfig,
        responseData: {
          title: info.videoDetails.title,
          duration: info.videoDetails.lengthSeconds
        }
      });

      return info;
    } catch (error) {
      await this.proxyService.logRequest({
        videoUrl,
        proxyInstance: proxyConfig.host,
        status: error.statusCode || 500,
        errorMessage: error.message,
        responseTime: Date.now() - startTime,
        proxyConfig
      });
      
      throw error;
    }
  }
}