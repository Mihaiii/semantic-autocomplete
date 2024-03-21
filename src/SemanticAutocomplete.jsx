import React from "react";
import { Autocomplete } from "@mui/material";

const SemanticAutocomplete = React.forwardRef((props, ref) => {
    return (
        <Autocomplete
          {...props}
          ref={ref}
        />
      );
    });
    
    export default SemanticAutocomplete;