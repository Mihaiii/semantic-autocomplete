import React, { useState, useRef, useEffect } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { cos_sim } from "@xenova/transformers";
import EmbeddingsWorker from "./worker?worker&inline";

const SemanticAutocomplete = React.forwardRef((props, ref) => {
  const {
    loading: userLoading,
    onInputChange: userOnInputChange,
    onOpen: userOnOpen,
    onClose: userOnClose,
  } = props;
  const { onResult, threshold, pipelineParams, model, ...restOfProps } = props;
  const [options, setOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [parentSize, setParentSize] = useState(0);
  const worker = useRef(null);
  const optionsWithEmbeddings = useRef([]);
  const userInput = useRef("");
  const loading = userLoading ? true : isOpen && isLoading;
  const getOptionLabel = props.getOptionLabel || ((option) => option.label);

  useEffect(() => {
    if (!worker.current) {
      worker.current = new EmbeddingsWorker();

      worker.current.postMessage({
        type: "init",
        pipelineParams: pipelineParams,
        model: model,
      });
    }

    const onMessageReceived = (e) => {
      switch (e.data.status) {
        case "completeOptions":
          optionsWithEmbeddings.current = e.data.optionsWithEmbeddings;
          setOptions(props.options);
          setLoading(false);
          //if user writes text before the embeddings are computed
          if (userInput.current) {
            worker.current.postMessage({
              type: "computeInputText",
              text: userInput.current,
            });
          }
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

          if (threshold && e.data.inputText) {
            let index = sortedOptions.findIndex(
              (op) =>
                includesCaseInsensitive(
                  op.labelSemAutoCom,
                  e.data.inputText
                ) == false && op.sim < threshold
            );
            sortedOptions = sortedOptions.slice(0, index);
          }

          setOptions(sortedOptions);
          if (onResult) {
            onResult(sortedOptions);
          }
          break;
      }
    };

    worker.current.addEventListener("message", onMessageReceived);
    return () =>
      worker.current.removeEventListener("message", onMessageReceived);
  });

  useEffect(() => {
    setLoading(true);
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
    userInput.current = value;

    worker.current.postMessage({
      type: "computeInputText",
      text: value,
    });

    if (userOnInputChange) {
      userOnInputChange(event, value, reason);
    }
  };

  const handleOnOpen = (event) => {
    setIsOpen(true);

    if (userOnOpen) {
      userOnOpen(event);
    }
  };

  const handleOnClose = (event) => {
    setIsOpen(false);

    if (userOnOpen) {
      userOnClose(event);
    }
  };

  const renderLoadingInput = (params) => (
    <TextField
      {...params}
      InputProps={{
        ...params.InputProps,
        endAdornment: (
          <React.Fragment>
            <CircularProgress color="inherit" size={0.8 * parentSize} />
            {params.InputProps.endAdornment}
          </React.Fragment>
        ),
      }}
      ref={(node) => {
        if (node) {
          const inputElement = node.querySelector('input');
          if (inputElement && parentSize == 0) {
            //https://stackoverflow.com/a/62721389
            const { clientHeight, clientWidth } = inputElement;
            setParentSize(Math.min(clientHeight, clientWidth));
          }
        }
      }}
    />
  );

  return (
    <Autocomplete
      {...restOfProps}
      options={options}
      filterOptions={(x) => x}
      onInputChange={handleInputChange}
      loading={loading}
      onOpen={handleOnOpen}
      onClose={handleOnClose}
      ref={ref}
      {...(loading ? { renderInput: renderLoadingInput } : {})}
    />
  );
});

export default SemanticAutocomplete;
