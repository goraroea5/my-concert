import HttpRequest from "./httpRequest";

class UserProvider extends HttpRequest {
  getAllUsers() {
    return this.get("/user");
  }
  createUser(data) {
    return this.post("/user", data);
  }
  editUser(id, data) {
    return this.put(`/user/${id}`, data);
  }
  deleteUser(id) {
    return this.delete(`/user/${id}`);
  }
  login(data) {
    return this.post(`/user/login`, data);
  }
  booking(data) {
    return this.post(`/ticket/booking`, data);
  }
}

export default UserProvider;
