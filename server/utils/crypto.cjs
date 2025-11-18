const fs = require('fs');
const path = require('path');
const forge = require('node-forge');
const { publicKeyPath, privateKeyPath } = require('../certs/index.cjs');

/**
 * 生成 RSA 公钥和私钥对 (返回 PEM 格式的字符串)
 * @param {number} bits - 密钥长度，默认 2048
 * @returns {{ publicKey: string, privateKey: string }} 包含公钥和私钥字符串的对象
 */
function generateRsaKeyPair(bits = 2048) {
  try {
    // 生成密钥对
    const keypair = forge.pki.rsa.generateKeyPair({
      bits: bits,
      e: 0x10001 // 常用的公共指数
    });

    // 将公钥和私钥导出为 PEM 格式的字符串
    const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
    const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);

    return {
      publicKey: publicKeyPem,
      privateKey: privateKeyPem
    };
  } catch (error) {
    throw new Error(`生成密钥对失败: ${error.message}`);
  }
}

/**
 * 获取公钥字符串
 * @returns {string} 公钥字符串
 */
function getPublicPem() {
  return fs.readFileSync(publicKeyPath, 'utf8');
}

/**
 * 获取私钥字符串
 * @returns {string} 私钥字符串
 */
function getPrivatePem() {
  return fs.readFileSync(privateKeyPath, 'utf8');
}

/**
 * 使用公钥 (PEM 格式) 对明文进行 RSA-OAEP 加密。
 *
 * @param {string} plaintext - 要加密的明文字符串。
 * @param {string} publicKeyPem - 公钥，格式为 PEM (-----BEGIN PUBLIC KEY----- ... -----END PUBLIC KEY-----)。
 * @returns {Promise<string>} 返回 Base64 编码的加密后数据。
 * @throws {Error} 如果加密失败，则抛出错误。
 */
function encryptWithPublicPem(plaintext, publicKeyPem = getPublicPem()) {
  try {
    // 1. 从 PEM 字符串加载公钥
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

    // 2. 直接使用公钥的 encrypt 方法进行加密
    // 使用 RSA-OAEP 填充，并指定 SHA-256 哈希算法
    const encryptedBytes = publicKey.encrypt(plaintext, 'RSA-OAEP', {
      md: forge.md.sha256.create()
    });

    // 3. 将加密后的字节转换为 Base64 字符串以便传输
    return forge.util.encode64(encryptedBytes);

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`加密失败: ${error.message}`);
    }
    throw new Error('加密失败: 未知错误');
  }
}

/**
 * 使用私钥 (PEM 格式) 对密文进行 RSA-OAEP 解密。
 *
 * @param {string} encryptedDataB64 - Base64 编码的密文。
 * @param {string} privateKeyPem - 私钥，格式为 PEM (-----BEGIN PRIVATE KEY----- ... -----END PRIVATE KEY-----)。
 * @returns {Promise<string>} 返回解密后的明文字符串。
 * @throws {Error} 如果解密失败，则抛出错误。
 */
function decryptWithPrivatePem(encryptedDataB64, privateKeyPem = getPrivatePem()) {
  try {
    // 1. 将 Base64 编码的密文解码为原始字节
    const encryptedDataBytes = forge.util.decode64(encryptedDataB64);

    // 2. 从 PEM 字符串加载私钥
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);

    // 3. 使用与加密时相同的填充方案 (RSA-OAEP) 和哈希算法 (SHA-256)
    return privateKey.decrypt(encryptedDataBytes, 'RSA-OAEP', {
      md: forge.md.sha256.create()
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`解密失败: ${error.message}`);
    }
    throw new Error('解密失败: 未知错误');
  }
}

/**
 * 将 RSA 公钥或私钥 (PEM 字符串) 写入到指定的文件路径
 * @param {string} keyPem - PEM 格式的公钥或私钥字符串
 * @param {string} outputPath - 要写入的文件完整路径 (例如: './keys/public.pem')
 * @throws {Error} 当写入失败时抛出错误
 */
function writeKeyToFile(keyPem, outputPath) {
  try {
    // 1. 验证输入参数
    if (!keyPem || typeof keyPem !== 'string' || keyPem.trim() === '') {
      throw new Error('密钥字符串不能为空');
    }

    if (!outputPath || typeof outputPath !== 'string') {
      throw new Error('输出路径必须是一个有效的字符串');
    }

    const trimmedKey = keyPem.trim();

    // 2. 判断是公钥还是私钥 (用于日志打印)
    let keyType = '未知';
    if (trimmedKey.startsWith('-----BEGIN PUBLIC KEY-----')) {
      keyType = '公钥 (Public Key)';
    } else if (trimmedKey.startsWith('-----BEGIN PRIVATE KEY-----') ||
      trimmedKey.startsWith('-----BEGIN RSA PRIVATE KEY-----')) {
      keyType = '私钥 (Private Key)';
    } else {
      console.warn(`⚠️  警告: 密钥格式可能不标准。开头: ${trimmedKey.substring(0, 30)}...`);
      // 即使不是标准开头，我们仍然尝试写入
    }

    // 3. 确保输出目录存在
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      console.log(`📁 目录 "${dir}" 不存在，正在创建...`);
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ 目录 "${dir}" 创建成功`);
    }

    // 4. 写入文件
    // 使用 utf8 编码写入文本
    fs.writeFileSync(outputPath, trimmedKey + '\n', 'utf8'); // 添加换行符是 PEM 文件的惯例

    // 5. 获取文件信息以确认写入成功
    const stats = fs.statSync(outputPath);
    const fileSizeKB = (stats.size / 1024).toFixed(2);

    // 6. 打印关键信息
    console.log('\n========================================');
    console.log('🔐 密钥写入成功!');
    console.log('----------------------------------------');
    console.log(`类型:     ${keyType}`);
    console.log(`路径:     ${path.resolve(outputPath)}`); // 输出绝对路径
    console.log(`大小:     ${fileSizeKB} KB (${stats.size} 字节)`);
    console.log(`修改时间: ${stats.mtime.toLocaleString()}`);
    console.log('========================================\n');

  } catch (error) {
    // 捕获并重新抛出错误，同时打印上下文信息
    const errorMsg = `❌ 写入密钥到 "${outputPath}" 失败: ${error.message}`;
    console.error(errorMsg);
    throw new Error(errorMsg); // 让调用者也能处理错误
  }
}

module.exports = {
  generateRsaKeyPair,
  encryptWithPublicPem,
  decryptWithPrivatePem,
  writeKeyToFile,
  getPublicPem,
  getPrivatePem,
};

// ==================== 使用示例 ====================

async function demo() {
  const originalMessage = "这是一个需要保密的重要消息！";

  try {
    console.log('🚀 开始 RSA 字符串加解密演示...\n');

    // 1. 生成密钥对
    console.log('1. 生成 2048 位 RSA 密钥对...');
    const keys = generateRsaKeyPair(2048);
    console.log('✅ 密钥对生成成功\n');

    // 如果你想查看生成的密钥 (调试用)
    // console.log('公钥:\n', keys.publicKey);
    // console.log('私钥:\n', keys.privateKey);

    // 2. 使用公钥字符串加密
    console.log('2. 使用公钥加密消息...');
    const encrypted = encryptWithPublicPem(originalMessage, keys.publicKey);
    console.log('🔐 加密后的 Base64 字符串:');
    console.log(encrypted, '\n');

    // 3. 使用私钥字符串解密
    console.log('3. 使用私钥解密消息...');
    const decrypted = decryptWithPrivatePem(encrypted, keys.privateKey);
    console.log('🔓 解密后的原文:');
    console.log(decrypted, '\n');

    // 4. 验证结果
    if (originalMessage === decrypted) {
      console.log('🎉 恭喜！加解密成功，原文与解密后内容一致！');
    } else {
      console.error('❌ 失败！解密后的内容与原文不符。');
    }

  } catch (error) {
    console.error('❌ 操作过程中发生错误:', error.message);
  }
}