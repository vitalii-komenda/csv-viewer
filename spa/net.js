class Net {
  constructor() {
    this.url = 'http://localhost:3000';
  }

  uploadFile(file, progressCb = ()=>{}) {
    const fd = new FormData();
    fd.append('file', file);
    return this.send('import', fd, 'POST', progressCb);
  }

  search(query) {
    return this.send('search', 'query=' + query, 'POST');
  }

  isEmpty() {
    return this.send('info', null, 'GET');
  }

  send(route, query, method, fileUploadingProgress) {
    return new Promise((resolve, reject)=>{
      const request = new XMLHttpRequest();
      request.onreadystatechange = function () { 
        if (request.readyState === 4) {
          if (request.status === 200) {
            resolve(JSON.parse(request.responseText));
          } else {
            reject(request.statusText);
          }
        } 
      }
      request.open(method, this.url + '/' + route, true);
      if (method === 'POST' && !fileUploadingProgress) {
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      }
      if (fileUploadingProgress) {
        request.upload.onprogress = function(e) {
          if (e.lengthComputable) {
            fileUploadingProgress(((e.loaded / e.total) * 100).toFixed(0));
          }
        };
      }
      request.send(query);
    })
  }
}