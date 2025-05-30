import React, { useState } from 'react';
import Input from '../common/Input';

const Searchbar = ({ placeholder = "Buscar..." }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="searchContainer">
            <Input
            type="text"
            name="search"
            label="" 
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={placeholder}
            containerClassName="mb-0"
            />
        </div>
    );

};

export default Searchbar;
