import { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const [weather, setWeather] = useState({});
    const [values, setValues] = useState([]);
    const [place, setPlace] = useState("Jaipur");
    const [thisLocation, setLocation] = useState("");

    // fetch api
    const fetchWeather = async (location) => {
        const options = {
            method: "GET",
            url: "https://visual-crossing-weather.p.rapidapi.com/forecast",
            params: {
                aggregateHours: "24",
                location,
                contentType: "json",
                unitGroup: "metric",
                shortColumnNames: 0,
            },
            headers: {
                "X-RapidAPI-Key": "0316962493msh1aff17b59fb46f6p1257d5jsnb34639dd1597",
                "X-RapidAPI-Host": "visual-crossing-weather.p.rapidapi.com",
            },
        };

        try {
            const response = await axios.request(options);
            console.log("API Response:", response.data);
            
            if (response.data.locations) {
                const thisData = Object.values(response.data.locations)[0];
                setLocation(thisData.address || "Unknown Location");
                setValues(thisData.values || []);
                setWeather(thisData.values[0] || {});
            } else {
                throw new Error("Invalid data received.");
            }
        } catch (error) {
            console.error("API Error:", error);
            alert(
                error.response?.data?.message ||
                "An error occurred while fetching weather data. Please try again."
            );
        }
    };

    useEffect(() => {
        fetchWeather(place);
    }, [place]);

    return (
        <StateContext.Provider
            value={{
                weather,
                setPlace,
                values,
                thisLocation,
                place,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
