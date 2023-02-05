import { useState } from "react";
import "./App.css";
import Navbar from "./Navbar";
import Tracker from "./Tracker";
import Notepad from "./Notepad";
//vite routing
import { createMemoryRouter, Route, RouterProvider } from "react-router-dom";

const router = createMemoryRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Tracker />
      </>
    ),
  },
  {
    path: "/notepad",
    element: (
      <>
        <Navbar />
        <Notepad />
      </>
    ),
  },
]);

function App() {
  //add routes
  return (
    <RouterProvider router={router}>
      <div className="App">
        <Route />
      </div>
    </RouterProvider>
  );
}

export default App;
