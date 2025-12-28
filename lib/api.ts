import axios from "axios";

// Axios instance (base URL ONLY)
const api = axios.create({
  baseURL: "https://us-central1-summaristt.cloudfunctions.net",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---- Types ----
export interface BookAPI {
  id: string;
  author: string;
  title: string;
  subTitle: string;
  imageLink: string;
  audioLink: string;
  totalRating: number;
  averageRating: number;
  keyIdeas: number;
  type: string;
  status: string;
  subscriptionRequired: boolean;
  summary: string;
  tags: string[];
  bookDescription: string;
  authorDescription: string;
}

// ---- API Calls ----
export const getSelectedBook = async (): Promise<BookAPI | null> => {
  const response = await api.get<BookAPI[]>("/getBooks", {
    params: { status: "selected" },
  });

  return response.data.length > 0 ? response.data[0] : null;
};

//--Book Details by ID
export const getBookById = async (id: string) => {
  try {
    const response = await axios.get(`https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching book with id ${id}:`, error);
    return null;
  }
};

//--Recommended Books//
export const getRecommendedBooks = async (): Promise<BookAPI[]> => {
  const response = await api.get<BookAPI[]>("/getBooks", {
    params: { status: "recommended" },
  });
  return response.data;
};


//--Suggested Books//
export const getSuggestedBooks = async (): Promise<BookAPI[]> => {
  const response = await api.get<BookAPI[]>("/getBooks", {
    params: { status: "suggested" },
  });
  return response.data;
};


// ---- Search Books by Author or Title/Keyword---//

export const getBooksBySearch = async (searchQuery: string): Promise<BookAPI[]> => {
  try {
    const response = await api.get<BookAPI[]>("/getBooksByAuthorOrTitle", {
      params: { search: searchQuery },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
};

export default api;
