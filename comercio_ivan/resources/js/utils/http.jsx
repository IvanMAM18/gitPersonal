const http = {
  HTTP_HOST: '/app',
  API: '',

  headers: {
    'Content-Type': 'application/json'
  },

  setHeader (key, value) {
    this.headers[key] = value
  },

  async get (route) {
    try {
      const response = await fetch(this.HTTP_HOST + this.API + route, {
        method: 'GET',
        headers: this.headers
      })
      return response.json()
    } catch (err) {
      throw err
    }
  },

  async post (route, body) {
    try {
      // console.warn('POST ' + this.HTTP_HOST + this.API + route);
      const response = await fetch(this.HTTP_HOST + this.API + route, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(body),
      });
      return response.json();
    } catch (err) {
      throw err
    }
  },

  async put (route, body) {
    try {
      // console.warn('POST ' + this.HTTP_HOST + this.API + route);
      const response = await fetch(this.HTTP_HOST + this.API + route, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(body),
      });
      return response.json();
    } catch (err) {
      throw err
    }
  },

  async delt (route, body) {
    try {
      // console.warn('POST ' + this.HTTP_HOST + this.API + route);
      const response = await fetch(this.HTTP_HOST + this.API + route, {
        method: 'DELETE',
        headers: this.headers,
        body: JSON.stringify(body),
      });
      return response.json();
    } catch (err) {
      throw err
    }
  },
}

export default http