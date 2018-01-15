# Qiniu Upload

上传文件到七牛云

## Installation

```sh
npm install qiniu-up --save
```

## Usage

### 需要选择文件

```javascript
import configUpload from 'qiniu-up';

const upload = configUpload({
  token: async () => { // token或者获取token的函数
    return 'token';
  },
  domain: 'https://cdn.example.com', // 下载域名, 用于拼接下载地址
  getKey() { // key生成函数, 默认资源文件SHA1
    return 'key';
  },
  host: '', // 上传目标host, 默认http://upload.qiniu.com
  chunkSize: 256 * 1024, // chunk大小, 默认256KB
  blockSize: 4 * 1024 * 1024, // block大小, 默认4MB
});

upload({
  limit: 1, // 上传文件个数限制, 默认1
  accept: '', // 图片mimetype限制, 同input的accept
  maxSize: 20 * 1024 * 1024, // 上传文件大小限制, 默认20MB
  onStart: () => {
    console.log('start');
  },
  onProgress: (uploaded, total) => {
    console.log('progress', uploaded, total);
  },
  onSuccess: (fileInfo) => {
    console.log('complete', fileInfo);
    const { hash, key, name, size, type, url } = fileInfo;
  },
  onError: (err) => {
    console.log('errror', err);
  },
});
```

### 不需要选择文件

```javascript
import { upload } from 'qiniu-up';

const { hash, key, name, size, type, url } = await upload(file, {
  token: async () => { // token或者获取token的函数
    return 'token';
  },
  domain: 'https://cdn.example.com', // 下载域名, 用于拼接下载地址
  getKey() { // key生成函数, 默认资源文件SHA1
    return 'key';
  },
  host: '', // 上传目标host, 默认http://upload.qiniu.com
  chunkSize: 256 * 1024, // chunk大小, 默认256KB
  blockSize: 4 * 1024 * 1024, // block大小, 默认4MB
  onProgress(uploaded, total) { // 单个文件进度
    console.log(uploaded, total);
  },
});
```

## License

[MIT](LICENSE)
