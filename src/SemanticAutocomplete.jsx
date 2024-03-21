import React, { useState, useRef, useEffect } from "react";
import { Autocomplete } from "@mui/material";
import { cos_sim } from "@xenova/transformers";
import EmbeddingsWorker from "./worker?worker&inline";

const SemanticAutocomplete = React.forwardRef((props, ref) => {
  const { onInputChange: userOnInputChange } = props;
  const [options, setOptions] = useState([]);
  const worker = useRef(null);
  const optionsWithEmbeddings = useRef([]);
  const getOptionLabel = props.getOptionLabel || ((option) => option.label);
  useEffect(() => {
    if (!worker.current) {
      worker.current = new EmbeddingsWorker();
    }

    const onMessageReceived = (e) => {
      switch (e.data.status) {
        case "completeOptions":
          optionsWithEmbeddings.current = e.data.optionsWithEmbeddings;
          setOptions(props.options);
          break;

        case "completeInputText":
          var sortedOptions = optionsWithEmbeddings.current
            .map((option) => ({
              ...option,
              sim: cos_sim(option.embeddings, e.data.inputTextEmbeddings),
            }))
            .sort((optionA, optionB) => {
              const containsA = includesCaseInsensitive(
                optionA.labelSemAutoCom,
                e.data.inputText
              );
              const containsB = includesCaseInsensitive(
                optionB.labelSemAutoCom,
                e.data.inputText
              );

              if (containsA == containsB) {
                return optionB.sim - optionA.sim;
              }
              return containsA ? -1 : 1;
            });

          if (props.threshold) {
            let index = sortedOptions.findIndex(
              (op) =>
                !includesCaseInsensitive(
                  op.labelSemAutoCom,
                  e.data.inputText
                ) && op.sim < props.threshold
            );
            sortedOptions = sortedOptions.slice(0, index);
          }

          setOptions(sortedOptions);
          break;
      }
    };

    worker.current.addEventListener("message", onMessageReceived);
    return () =>
      worker.current.removeEventListener("message", onMessageReceived);
  });

  useEffect(() => {
    worker.current.postMessage({
      type: "computeOptions",
      options: props.options.map((op) => ({
        ...op,
        labelSemAutoCom: getOptionLabel(op),
      })),
    });
  }, [props.options]);

  const includesCaseInsensitive = (fullText, lookupValue) => {
    return fullText.toLowerCase().includes(lookupValue.toLowerCase());
  };

  const handleInputChange = (event, value, reason) => {
    worker.current.postMessage({
      type: "computeInputText",
      text: value,
    });

    if (userOnInputChange) {
      userOnInputChange(event, value, reason);
    }
  };

  return (
    <Autocomplete
      {...props}
      options={options}
      onInputChange={handleInputChange}
      filterOptions={(x) => x}
      ref={ref}
    />
  );
});

export default SemanticAutocomplete;
