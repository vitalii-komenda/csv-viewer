class Net {
  constructor() {
    this.url = 'http://localhost:3000';
  }

  uploadFile(file) {
    const fd = new FormData();
    fd.append('file', file);
    return this.send('import', fd, 'POST', true);
  }

  search(query) {
    return this.send('search', "query=" + query, 'POST');
  }

  isEmpty() {
    return this.send('info', null, 'GET');
  }

  send(route, query, method, isFile=false) {
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
      if (method === 'POST' && isFile === false) {
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      }
      request.send(query);
    })
  }
}