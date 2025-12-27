export const jokeFetch = (signal?: AbortSignal) => {
  return fetch(
    "https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit",
    { signal }
  ).then((res) => res.json());
};
