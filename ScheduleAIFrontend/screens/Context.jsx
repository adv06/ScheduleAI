import { createContext, useState} from "react";


export const Context = createContext();

export const Provider = ({children}) => {
    const [token, setToken] = useState(null);
    return (
        <Context.Provider value={{token, setToken}}>
            {children}
        </Context.Provider>
    )
}