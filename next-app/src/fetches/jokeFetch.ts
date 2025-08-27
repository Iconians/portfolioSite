export const jokeFetch = () => {
  return fetch("https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit")
  .then((res) => res.json())
}