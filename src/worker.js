import { env, pipeline } from "@xenova/transformers";

class MyEmbeddingsPipeline {
  static task = "embeddings";
  static model = "TaylorAI/bge-micro-v2";
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      //we get the models from huggingface. Ex: https://huggingface.co/TaylorAI/bge-micro-v2
      env.allowLocalModels = false;
      this.instance = pipeline(this.task, this.model, { progress_callback });
    }

    return this.instance;
  }
}

self.addEventListener("message", async (event) => {
  let embeddingsPipeline = await MyEmbeddingsPipeline.getInstance();

  switch (event.data.type) {
    case "computeOptions":
      const optionPromises = event.data.options.map(async (option) => {
        return {
          ...option,
          embeddings: await embeddingsPipeline(option.labelSemAutoCom, {
            pooling: "mean",
            normalize: true,
          }),
        };
      });
      let optionsWithEmbeddings = await Promise.all(optionPromises);
      let optionsWithEmbeddingsData = optionsWithEmbeddings.map((op) => ({
        ...op,
        embeddings: op.embeddings.data,
      }));
      self.postMessage({
        status: "completeOptions",
        optionsWithEmbeddings: optionsWithEmbeddingsData,
      });
      break;
  }
});
