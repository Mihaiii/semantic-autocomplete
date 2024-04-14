# semantic-autocomplete

semantic-autocomplete is a Material UI v5 React component that extends [MUI's autocomplete](https://v5.mui.com/material-ui/react-autocomplete/) and performs similarity search using a small, quantized machine learning (ML) model which runs on client side. The full functionality is provided within this React component!

## Demo

**Search/sort on a text's paragraphs of a webpage:**

https://huggingface.co/spaces/Mihaiii/semantic-autocomplete-demo-1

**Simple demo searching/sorting & filtering the options of a dropdown:**

https://huggingface.co/spaces/Mihaiii/semantic-autocomplete-demo-2

## How to install
Install:

`npm install --save semantic-autocomplete`

Then import:

`import SemanticAutocomplete from "semantic-autocomplete";`
## Usage

Since semantic-autocomplete extends [MUI's autocomplete](https://v5.mui.com/material-ui/react-autocomplete/), this means that the entire [v5 MUI's autocomplete API](https://v5.mui.com/material-ui/api/autocomplete/) will also work on semantic-autocomplete. The only exception is the [filterOptions property](https://mui.com/material-ui/react-autocomplete/#custom-filter).

You can see the component being used in code [here](https://github.com/Mihaiii/semantic-autocomplete/blob/6d312a6264b7c3b79d053e23d3cdb4cf226196a1/demos/paragraphs_as_options/App.jsx#L26-L34) and [here](https://github.com/Mihaiii/semantic-autocomplete/blob/6d312a6264b7c3b79d053e23d3cdb4cf226196a1/demos/simple_autocomplete/App.jsx#L107-L112).


[See this page for how you can use MUI's autocomplete and therefore semantic-autocomplete too](https://v5.mui.com/material-ui/react-autocomplete/). 

Besides the MUI's autocomplete API, the following props are provided:

`threshold`: if it has a value, then the component will filter out options below this cosine similarity value. Defaults to no value (meaning no filtering, only sorting). [Click for code example](https://github.com/Mihaiii/semantic-autocomplete/blob/6d312a6264b7c3b79d053e23d3cdb4cf226196a1/demos/simple_autocomplete/App.jsx#L110).

`onResult`: callback function once the sorting/filtering of the options is done, using the resulted options areay as first param. [Click for code example](https://github.com/Mihaiii/semantic-autocomplete/blob/6d312a6264b7c3b79d053e23d3cdb4cf226196a1/demos/paragraphs_as_options/App.jsx#L29).

`model`: the name of the Huggingface ML model repo. It has to have the ONNX embeddings model. The folder structure of the repo has to be the standard one used by transformers.js. If you're interested in changing the default used model, you might find [this filter](https://huggingface.co/models?pipeline_tag=sentence-similarity&library=onnx&sort=trending) useful. Defaults value: `TaylorAI/gte-tiny` (pointing to [this repo](https://huggingface.co/TaylorAI/gte-tiny)), which loads the ONNX quantized model having ~23 MB. [Click here for code example](https://github.com/Mihaiii/semantic-autocomplete/blob/b16115492466eb1502107cf4581a804cb1dcbbe4/demos/simple_autocomplete/App.jsx#L115)

`pipelineParams`: the params to be passed to [transformer.js](https://github.com/xenova/transformers.js) when loading the model. Default value: `{ pooling: "mean", normalize: true }`. For more info, please [see this page](https://huggingface.co/docs/transformers.js/api/pipelines#module_pipelines.FeatureExtractionPipeline).

## Thanks / credit
- [xonova](https://x.com/xenovacom?t=Mw1h_1joKgfrUXR_wl9Wrg&s=09) for building [transformers.js](https://github.com/xenova/transformers.js), providing clear & in detail documentation, always being willing to help out and for having [lots of demos](https://github.com/xenova/transformers.js/tree/main/examples) on [his HF account](https://huggingface.co/Xenova). The work for this component is based on his tutorial on [how to build a React component using tranaformers.js](https://huggingface.co/docs/transformers.js/en/tutorials/react).
- [andersonbcdefg](https://x.com/andersonbcdefg?t=0Nkr_SRk-fMUrU_Kp0Wm5w&s=09) for building [gte-tiny](https://huggingface.co/TaylorAI/gte-tiny), which is the default model used in this component. It's an excellent model and it made this repo possible, given I needed a very capable and small model. Note that on TaylorAI there is even a smaller model (17.4 MB) that can be used via the model property of semantic-autocomplete: [bge-micro-v2](https://huggingface.co/TaylorAI/bge-micro-v2).
