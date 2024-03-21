import { env, pipeline } from "@xenova/transformers";

let configs = {
  pipelineParams: { pooling: "mean", normalize: true },
  model: "TaylorAI/bge-micro-v2",
};

class MyEmbeddingsPipeline {
  static task = "embeddings";
  static model = configs.model;
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      env.allowLocalModels = false;
      this.instance = pipeline(this.task, this.model, { progress_callback });
    }

    return this.instance;
  }
}

self.addEventListener("message", async (event) => {
  let embeddingsPipeline = await MyEmbeddingsPipeline.getInstance();

  switch (event.data.type) {
    case "init":
      configs.pipelineParams = event.data.pipelineParams || configs.pipelineParams;
      configs.model = event.data.model || configs.model;
      break;

    case "computeOptions":
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

    case "computeInputText":
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
});
