// models/AuthModel.js
import storyApi from "../services/api.js";
import { setToken, setUserData } from "../utils/auth.js";

export class AuthModel {
  async login(email, password) {
    const response = await storyApi.login({ email, password });
    if (response.error) {
      throw new Error(response.message);
    }
    setToken(response.loginResult.token);
    setUserData({
      userId: response.loginResult.userId,
      name: response.loginResult.name,
    });
  }

  async register(name, email, password) {
    const response = await storyApi.register({ name, email, password });
    if (response.error) {
      throw new Error(response.message);
    }
  }
}
