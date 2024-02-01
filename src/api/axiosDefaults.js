import axios from "axios";

axios.defaults.baseURL = "https://josip-drf-api-d66c735b7edd.herokuapp.com/"
// multipart as our app will deal with images, texts...
axios.defaults.headers.post['Content-Type'] = "multipart/form-data"
axios.defaults.withCredentials = true;