import React, { useState } from 'react';
import Input from '../common/Input';

const Searchbar = ({ placeholder = "Buscar..." }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="searchContainer ">
            <Input
            type="text"
            name="search"
            label="" 
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={placeholder}
            icon="bi-search"
            containerClassName="mb-0"
            onIconClick={() => alert("Buscar:", searchTerm)}
            inputClassName="rounded=full py-1 h-8 text-sm"
            />

        </div>
    );

};

export default Searchbar;
