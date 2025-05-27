import api from "@/services/api";

export async function createPoll(pollData) {
  try {
    const { data } = await api.post("api/v1/polls", pollData);
    return data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    };
  }
}

export async function fetchAllPolls() {
  try {
    const { data } = await api.get("api/v1/polls");
    return data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    };
  }
}

export async function votePoll(pollId, optionId) {
  try {
    const { data } = await api.post(`api/v1/polls/${pollId}/vote`, {
      optionId: optionId
    });
    return data;
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    };
  }
}