class ProductService {
  async fetchAdvice () {
    
    return new Promise(async (success, fail) => {
      const url = "https://api.adviceslip.com/advice"
      const response = await fetch(url)
      if(response.ok) {
        const json = await response.json()
        const advice = json.slip
      success( {response, advice} )
      }
      else {
        fail({error: "invalid advice"})
      }
    })
  }
}

export default ProductService