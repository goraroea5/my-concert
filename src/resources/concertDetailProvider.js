import HttpRequest from "./httpRequest";

class ConcertDetailProvider extends HttpRequest {
  getAllConcert() {
    return this.get("/concert-detail");
  }
  getConcertById(id) {
    return this.get(`/concert-detail/${id}`);
  }
  createConcert(data) {
    return this.post(`/concert-detail`, data);
  }
  editConcert(id, data) {
    return this.put(`/concert/${id}`, data);
  }
  editZoneDetail(id, data) {
    return this.put(`/zone-detail/${id}`, data);
  }
  deleteConcert(id) {
    return this.delete(`/concert/${id}`);
  }
  getAllZone() {
    return this.get(`/zone`);
  }
  createZone(data) {
    return this.post(`/zone`, data);
  }
  editZone(id, data) {
    return this.put(`/zone/${id}`, data);
  }
  deleteZone(id) {
    return this.delete(`/zone/${id}`);
  }
  getLogSelling() {
    return this.get(`/ticket`);
  }
}

export default ConcertDetailProvider;
