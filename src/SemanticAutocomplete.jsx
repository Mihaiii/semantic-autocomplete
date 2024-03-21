import React, { useState, useRef, useEffect } from "react";
import { Autocomplete } from "@mui/material";
import EmbeddingsWorker from "./worker?worker&inline"

const SemanticAutocomplete = React.forwardRef((props, ref) => {
    const [options, setOptions] = useState([]);
    const worker = useRef(null);
    const getOptionLabel = props.getOptionLabel || ((option) => option.label);
    useEffect(() => {
        if (!worker.current) {
          worker.current = new EmbeddingsWorker();
        }
    
        const onMessageReceived = (e) => {
          switch (e.data.status) {
            case "completeOptions":
                //TODO store received computted emeddings
              setOptions(props.options);
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

    return (
        <Autocomplete
          {...props}
          options={options}
          ref={ref}
        />
      );
    });
    
    export default SemanticAutocomplete;