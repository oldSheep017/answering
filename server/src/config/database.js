const mongoose = require('mongoose');

/**
 * 数据库连接配置
 * 提供连接、断开和错误处理功能
 */
class Database {
  constructor() {
    this.isConnected = false;
  }

  /**
   * 连接到 MongoDB 数据库
   * @param {string} uri - MongoDB 连接字符串
   * @returns {Promise<void>}
   */
  async connect(uri) {
    try {
      if (this.isConnected) {
        console.log('数据库已经连接');
        return;
      }

      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
        bufferMaxEntries: 0,
      };

      await mongoose.connect(uri, options);
      
      this.isConnected = true;
      console.log('✅ MongoDB 连接成功');

      // 监听连接事件
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB 连接错误:', err);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.log('⚠️ MongoDB 连接断开');
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB 重新连接成功');
        this.isConnected = true;
      });

      // 优雅关闭
      process.on('SIGINT', async () => {
        await this.disconnect();
        process.exit(0);
      });

    } catch (error) {
      console.error('❌ MongoDB 连接失败:', error);
      throw error;
    }
  }

  /**
   * 断开数据库连接
   * @returns {Promise<void>}
   */
  async disconnect() {
    try {
      if (this.isConnected) {
        await mongoose.connection.close();
        this.isConnected = false;
        console.log('✅ MongoDB 连接已关闭');
      }
    } catch (error) {
      console.error('❌ 关闭数据库连接时出错:', error);
      throw error;
    }
  }

  /**
   * 获取连接状态
   * @returns {boolean}
   */
  getConnectionStatus() {
    return this.isConnected;
  }
}

module.exports = new Database(); 