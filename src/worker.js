import { env, pipeline } from "@xenova/transformers";

let configs = {
  pipelineParams: { pooling: "mean", normalize: true },
  model: "TaylorAI/gte-tiny",
};

class MyEmbeddingsPipeline {
  static task = "embeddings";
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      //we get the models from huggingface. Ex: https://huggingface.co/TaylorAI/bge-micro-v2
      env.allowLocalModels = false;
      this.instance = pipeline(this.task, configs.model, { progress_callback });
    }

    return this.instance;
  }
}

self.addEventListener("message", async (event) => {
  switch (event.data.type) {
    case "init":
      configs.pipelineParams =
        event.data.pipelineParams || configs.pipelineParams;
      configs.model = event.data.model || configs.model;
      break;

    case "computeOptions": {
      let embeddingsPipeline = await MyEmbeddingsPipeline.getInstance();
      const optionPromises = event.data.options.map(async (option) => {
        return {
          ...option,
          embeddings: await embeddingsPipeline(
            option.labelSemAutoCom,
            configs.pipelineParams
          ),
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
    case "computeInputText": {
      let embeddingsPipeline = await MyEmbeddingsPipeline.getInstance();
      let embeddings = await embeddingsPipeline(
        event.data.text,
        configs.pipelineParams
      );

      self.postMessage({
        status: "completeInputText",
        inputTextEmbeddings: embeddings.data,
        inputText: event.data.text,
      });
      break;
    }
  }
});
