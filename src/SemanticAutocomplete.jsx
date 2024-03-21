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
  const [options, setOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
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
        pipelineParams: props.pipelineParams,
        model: props.model,
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
            <CircularProgress color="inherit" />
            {params.InputProps.endAdornment}
          </React.Fragment>
        ),
      }}
    />
  );

  return (
    <Autocomplete
      {...props}
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
