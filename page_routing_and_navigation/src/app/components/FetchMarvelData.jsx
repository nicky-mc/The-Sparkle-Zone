import axios from "axios";
import md5 from "md5";

const publicKey = "acd8dde3905a52aee2158bcaad534542";
const privateKey = "166565337f589e692c7754078e37348f64e7d169";
const ts = new Date().getTime();
const hash = md5(ts + privateKey + publicKey);

const fetchMarvelData = async (searchTerm) => {
  const response = await axios.get(
    `https://gateway.marvel.com:443/v1/public/characters`,
    {
      params: {
        apikey: publicKey,
        ts: ts,
        hash: hash,
        nameStartsWith: searchTerm,
      },
    }
  );
  return response.data.data.results;
};

export default fetchMarvelData;
