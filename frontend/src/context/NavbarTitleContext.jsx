import React, { createContext, useContext, useState } from 'react';

const NavbarTitleContext = createContext();
export function NavbarTitleProvider({ children }) {
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");

    return (
    <NavbarTitleContext.Provider value={{ title, setTitle, subtitle, setSubtitle }}>
    {children}
    </NavbarTitleContext.Provider>
    );
}

export function useNavbarTitle() {
    return useContext(NavbarTitleContext);
}

export default NavbarTitleContext;

