import { validToken } from "../services/auth";

const validateToken = async () => {
  const { status } = await validToken();
  return status;
}
export default validateToken;