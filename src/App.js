import "./App.css";
import CustomNavbar from "./components/UI/Navbar/CustomNavbar"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import React from "react";
import AppRouter from "./AppRouter";
import {AlertProvider} from "./AlertProvider";
import {AuthProvider} from "./AuthProvider";

function App() {
  return (
      <div className="App">
          <AlertProvider>
              <AuthProvider>
                  <BrowserRouter>
                      <CustomNavbar />
                      <AppRouter />
                  </BrowserRouter>
              </AuthProvider>
          </AlertProvider>
      </div>
  );
}

export default App;
