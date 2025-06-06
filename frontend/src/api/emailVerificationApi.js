import api from "@/services/api";

export async function sendVerificationEmail(email) {
  try {
    const response = await api.post('api/v1/email-verification', {
      email: email
    });
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    };
  }
}

export async function verifyEmailCode(email, code) {
  try {
    const response = await api.put('api/v1/email-verification', {
      email: email,
      code: code
    });
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    };
  }
}

export async function checkVerificationStatus(email) {
  try {
    const response = await api.get(`api/v1/email-verification?email=${encodeURIComponent(email)}`);
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    };
  }
}