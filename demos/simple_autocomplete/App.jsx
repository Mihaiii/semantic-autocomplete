import SemanticAutocomplete from "../../src/SemanticAutocomplete";
import { TextField } from "@mui/material";
import HorizontalLinkList from '../HorizontalLinkList.jsx'
import React from 'react'

function App() {
  const options = [
    { label: "Spoon", value: 1 },
    { label: "Fork", value: 2 },
    { label: "Knife", value: 3 },
    { label: "Plate", value: 4 },
    { label: "Cup", value: 5 },
    { label: "Mug", value: 6 },
    { label: "Bowl", value: 7 },
    { label: "Teapot", value: 8 },
    { label: "Frying Pan", value: 9 },
    { label: "Saucepan", value: 10 },
    { label: "Spatula", value: 11 },
    { label: "Whisk", value: 12 },
    { label: "Oven Mitt", value: 13 },
    { label: "Cutting Board", value: 14 },
    { label: "Measuring Cup", value: 15 },
    { label: "Blender", value: 16 },
    { label: "Toaster", value: 17 },
    { label: "Microwave", value: 18 },
    { label: "Refrigerator", value: 19 },
    { label: "Dishwasher", value: 20 },
    { label: "Table", value: 21 },
    { label: "Chair", value: 22 },
    { label: "Sofa", value: 23 },
    { label: "Lamp", value: 24 },
    { label: "Bookshelf", value: 25 },
    { label: "Bed", value: 26 },
    { label: "Mattress", value: 27 },
    { label: "Pillow", value: 28 },
    { label: "Blanket", value: 29 },
    { label: "Dresser", value: 30 },
    { label: "Mirror", value: 31 },
    { label: "Alarm Clock", value: 32 },
    { label: "Curtains", value: 33 },
    { label: "Rug", value: 34 },
    { label: "Trash Can", value: 35 },
    { label: "Laundry Basket", value: 36 },
    { label: "Washing Machine", value: 37 },
    { label: "Dryer", value: 38 },
    { label: "Iron", value: 39 },
    { label: "Vacuum Cleaner", value: 40 },
    { label: "Broom", value: 41 },
    { label: "Mop", value: 42 },
    { label: "Bucket", value: 43 },
    { label: "Garden Hose", value: 44 },
    { label: "Rake", value: 45 },
    { label: "Shovel", value: 46 },
    { label: "Lawn Mower", value: 47 },
    { label: "Hammer", value: 48 },
    { label: "Screwdriver", value: 49 },
    { label: "Wrench", value: 50 },
    { label: "Drill", value: 51 },
    { label: "Saw", value: 52 },
    { label: "Nails", value: 53 },
    { label: "Screws", value: 54 },
    { label: "Bolts", value: 55 },
    { label: "Paint Brush", value: 56 },
    { label: "Roller", value: 57 },
    { label: "Paint", value: 58 },
    { label: "Vase", value: 59 },
    { label: "Picture Frame", value: 60 },
    { label: "Candle", value: 61 },
    { label: "Book", value: 62 },
    { label: "Magazine", value: 63 },
    { label: "Remote Control", value: 64 },
    { label: "TV", value: 65 },
    { label: "Speaker", value: 66 },
    { label: "Laptop", value: 67 },
    { label: "Phone", value: 68 },
    { label: "Charger", value: 69 },
    { label: "Flashlight", value: 70 },
    { label: "Bicycle", value: 71 },
    { label: "Skateboard", value: 72 },
    { label: "Helmet", value: 73 },
    { label: "Ball", value: 74 },
    { label: "Gloves", value: 75 },
    { label: "Scarf", value: 76 },
    { label: "Umbrella", value: 77 },
    { label: "Backpack", value: 78 },
    { label: "Wallet", value: 79 },
    { label: "Keys", value: 80 },
    { label: "Sunglasses", value: 81 },
    { label: "Watch", value: 82 },
    { label: "Fitness Tracker", value: 83 },
    { label: "Yoga Mat", value: 84 },
    { label: "Treadmill", value: 85 },
    { label: "Weights", value: 86 },
    { label: "Swimsuit", value: 87 },
    { label: "Towel", value: 88 },
    { label: "Shampoo", value: 89 },
    { label: "Soap", value: 90 },
    { label: "Toothbrush", value: 91 },
    { label: "Toothpaste", value: 92 },
    { label: "Floss", value: 93 },
    { label: "Razor", value: 94 },
    { label: "Deodorant", value: 95 },
    { label: "Perfume", value: 96 },
    { label: "Makeup", value: 97 },
    { label: "Hairbrush", value: 98 },
  ];

  return (
    <div>
      <HorizontalLinkList />
      <SemanticAutocomplete
        freeSolo
        options={options}
        threshold={0.6}
        model="TaylorAI/bge-micro-v2"
        renderInput={(params) => <TextField {...params} placeholder="kitchen" />}
      />
    </div>
  );
}

export default App;
