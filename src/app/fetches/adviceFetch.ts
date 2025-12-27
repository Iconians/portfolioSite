class ProductService {
  async fetchAdvice(signal?: AbortSignal) {
    const url = "https://api.adviceslip.com/advice";
    const timeoutMs = 8000; // 8 second timeout

    // Create a timeout controller
    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => {
      timeoutController.abort();
    }, timeoutMs);

    // Combine signals: create a new controller that aborts when either signal aborts
    const combinedController = new AbortController();

    // Listen to timeout
    timeoutController.signal.addEventListener("abort", () => {
      combinedController.abort();
      clearTimeout(timeoutId);
    });

    // Listen to provided signal
    if (signal) {
      signal.addEventListener("abort", () => {
        combinedController.abort();
        clearTimeout(timeoutId);
      });
    }

    try {
      const response = await fetch(url, {
        signal: combinedController.signal,
        cache: "no-cache",
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      const advice = json.slip;
      return { response, advice };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          // Check if it was a timeout or user abort
          if (timeoutController.signal.aborted && !signal?.aborted) {
            throw new Error("Request timeout - API took too long to respond");
          }
          throw new Error("Request aborted");
        }
      }
      throw error;
    }
  }
}

export default ProductService;
