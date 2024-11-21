// youtube.service.ts
@Injectable()
export class YoutubeService {
  async getVideoInfo(videoUrl: string) {
    const proxyConfig = this.proxyService.getRandomProxy();
    const startTime = Date.now();
    
    try {
      // Không có retry, để lộ ra nguyên nhân thực sự
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
      // Log chi tiết lỗi để phân tích
      await this.proxyService.logRequest({
        videoUrl,
        proxyInstance: proxyConfig.host,
        status: error.statusCode || 500,
        errorMessage: JSON.stringify({
          message: error.message,
          stack: error.stack,
          name: error.name,
          code: error.code
        }),
        responseTime: Date.now() - startTime,
        proxyConfig
      });
      
      // Throw nguyên error để caller có thể phân tích
      throw error;
    }
  }
}