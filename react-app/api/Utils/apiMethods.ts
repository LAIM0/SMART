import api from './apiConfig';

class ApiMethods {
  static async apiRequest(method: string, url: string, data: any = null) {
    const config = {
      method,
      url, // baseURL est déjà défini dans l'instance 'api'
      data,
    };

    return api(config);
  }

  static get(url: string) {
    return this.apiRequest('GET', url);
  }

  static post(url: string, data: any) {
    return this.apiRequest('POST', url, data);
  }

  static put(url: string, data: any) {
    return this.apiRequest('PUT', url, data);
  }

  static delete(url: string) {
    return this.apiRequest('DELETE', url);
  }
}

export default ApiMethods;
