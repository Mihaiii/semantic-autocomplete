import SemanticAutocomplete from "../../src/SemanticAutocomplete";
import { TextField, ListItem, ListItemText, List } from "@mui/material";
import React, { useContext, useMemo } from 'react'
const SemanticAutocompleteMemoized = React.memo(SemanticAutocomplete)
import { SortedOptionsContext } from './context.jsx'
import jsonData from './data.json';

function App() {
  const options = useMemo(() => jsonData, []);
  const { sortedOptions, setSortedOptions } = useContext(SortedOptionsContext);
  
  const ResultsList = () => {
    return (
      <List>
        {sortedOptions.map(op => (
          <ListItem key={op.label + op.value}>
            <ListItemText primary={op.label} />
          </ListItem>
        ))}
      </List>
    );
  }
  
  return (
    <div>
      <SemanticAutocompleteMemoized
        freeSolo
        options={options}
        onResult={setSortedOptions}
        renderInput={(params) => <TextField {...params} placeholder="What are embeddings?" />}
        open={false}
        popupIcon={null}
      />
      <ResultsList />
    </div>
  );
}

export default App;
