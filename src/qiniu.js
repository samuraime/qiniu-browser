import uploadToQiniu from './upload';

const noop = () => {};

export const upload = uploadToQiniu;

/**
 * @param {File} file
 * @param {Object} config
 * @param {String|Function} config.token - token或者获取token的函数
 * @param {String} [config.host=http://upload.qiniu.com] - 上传目标host
 * @param {String} [config.domain=] - 下载域名, 用于拼接下载地址
 * @param {Number} [config.chunkSize=256 * 1024] - chunk大小, 默认256KB
 * @param {Number} [config.blockSize=4 * 1024 * 1024] - block大小, 默认4MB
 * @param {Function} [config.getKey] - key生成函数, 默认使用资源SHA1 (file: File) => string
 * @return {Promise}
 */
export default function configUpload(config) {
  /**
   * @param {Object} [options] - 上传选项
   * @param {String} [options.accept] - input mimetype限制
   * @param {Number} [options.limit=1] - 上传文件个数限制, 超出会自动截断
   * @param {Number} [options.maxSize=20 * 1024 * 1024] - 上传文件大小限制
   * @param {Function} [options.onStart] - 上传开始 (files: Array<file>) => void
   * @param {Function} [options.onProgress] - 文件个数进度 (uploaded: number, total: number) => void
   * @param {Function} [options.onSuccess] - 上传完成 (files: Array<object>) => void
   * @param {Function} [options.onError] - 上传异常 (error: error) => void
   */
  return function browserUpload({
    accept = '',
    limit = 1,
    maxSize = 20 * 1024 * 1024, // 20MB
    onStart = noop,
    onProgress = noop,
    onSuccess = noop,
    onError = noop,
  }) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.multiple = limit > 1;
    input.style.display = 'none';

    function destory() {
      document.body.removeChild(input);
    }

    // 文件选择完即开始上传
    input.addEventListener('change', async (event) => {
      const files = Array.from(event.target.files).slice(0, limit);
      let uploaded = 0;
      let uploadedFiles;
      try {
        files.forEach((file) => {
          if (file.size > maxSize) {
            throw new Error('exceed the maximum file size limit');
          }
        });

        onStart(files);
        uploadedFiles = await Promise.all(files.map(file => (
          uploadToQiniu(file, config).then((fileInfo) => {
            uploaded += 1;
            onProgress(uploaded, files.length);
            return fileInfo;
          })
        )));
      } catch (error) {
        onError(error);
        destory();
        return;
      }
      onSuccess(uploadedFiles);
      destory();
    });

    // 自动触发文件选择
    document.body.appendChild(input);
    input.click();
  };
}
