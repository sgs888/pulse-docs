import forge from 'node-forge';

/**
 * 使用公钥 (PEM 格式) 对明文进行 RSA-OAEP 加密。
 * @param plaintext 要加密的明文字符串
 * @param publicKeyPem 公钥，格式为 PEM (-----BEGIN PUBLIC KEY----- ... -----END PUBLIC KEY-----)
 * @returns 返回 Base64 编码的加密后数据
 */
function encryptWithPublicPem(plaintext: string, publicKeyPem: string) {
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

export const usePwdCrypto = () => {
  return {
    encryptWithPublicPem
  }
}