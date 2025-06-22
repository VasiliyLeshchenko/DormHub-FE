import React, {createContext, useContext, useState} from 'react';
import {Alert} from "react-bootstrap";
import {motion, AnimatePresence} from "framer-motion";

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({children}) => {
    const [alert, setAlert] = useState(null);

    const showAlert = (message, variant = "success", duration = 3000) => {
        setAlert({message, variant});
        setTimeout(() => setAlert(null), duration);
    };

    return (
        <AlertContext.Provider value={{alert, showAlert}}>
            {children}
            <AnimatePresence>
                {alert && (
                    <motion.div
                        key="alert"
                        initial={{opacity: 0, x: 100}}
                        animate={{opacity: 1, x: 0}}
                        exit={{opacity: 0, x: 300}}
                        transition={{duration: 0.4}}
                        style={{
                            position: "fixed",
                            top: 20,
                            right: 20,
                            zIndex: 9999,
                            minWidth: "300px"
                        }}
                    >
                        <Alert variant={alert.variant}>{alert.message}</Alert>
                    </motion.div>
                )}
            </AnimatePresence>
        </AlertContext.Provider>
    );
};
