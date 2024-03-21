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
    //TODO
  }
});
