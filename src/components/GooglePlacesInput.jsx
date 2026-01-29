import React, { useState, useEffect, use, useCallback } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import debounce from 'lodash/debounce';
import { GOOGLE_KEY } from '../config/Constants';

const GooglePlacesInput = ({ onPlaceSelected, minLength = 8, apiKey = GOOGLE_KEY, addresText }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const apiKey_ = apiKey ?? GOOGLE_KEY; // Replace with your Google Places API key

    useEffect(() => {
        setQuery(addresText);
    }, [addresText]);

    // Debounced function to fetch places
    const fetchPlaces = debounce((input) => {
        if (input && input.length >= minLength) {
            fetch(
                `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${apiKey_}&sessiontoken=${Date.now()}`
            )
                .then((response) => response.json())
                .then((data) => {
                    if (data.predictions) {
                        console.log(data.predictions)
                        setSuggestions(data.predictions);
                    }
                })
                .catch((error) => console.log('Error fetching places:', error));
        } else {
            setSuggestions([]);
        }
    }, 1000); // 500ms delay

    // useEffect(() => {
    //     fetchPlaces(query);

    //     // Cleanup debounce on unmount
    //     return () => {
    //         fetchPlaces.cancel();
    //     };
    // }, [query, fetchPlaces]);

    // const handleSelectPlace = (place) => {
    //     setQuery(place.description);
    //     setSuggestions([]);
    //     if (onPlaceSelected) {
    //         onPlaceSelected(place);
    //     }
    // };

    const handleSelectPlace = async (place) => {
        try {
            const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=geometry,name,formatted_address&key=${apiKey_}`;

            const response = await fetch(detailsUrl);
            const data = await response.json();

            if (data.result) {
                const { geometry, name, formatted_address } = data.result;
                const placeWithDetails = {
                    ...place,
                    geometry,
                    name,
                    formatted_address,
                };

                setQuery(place.description);
                setSuggestions([]);

                if (onPlaceSelected) {
                    onPlaceSelected(placeWithDetails);
                }
            }
        } catch (error) {
            console.error('Error fetching place details:', error);
        }
    };


    const handleSetQuery = (text) => {
        if (text !== query) {
            setQuery(text);
            fetchPlaces(text);
        }
    };

    const renderItem = useCallback(({ item }) => (
        <TouchableOpacity onPress={() => setSuggestions([])}>
            <Text style={styles.suggestion} onPress={() => handleSelectPlace(item)}>
                <Text role="img" aria-label="location" style={{ marginRight: 8 }}>📍</Text>
                {item ? item.description : ''}
            </Text>
        </TouchableOpacity>
    ), [suggestions]);

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={query}
                onChangeText={handleSetQuery}
                placeholder="Search for a place..."
                autoCapitalize="none"
                autoCorrect={false}

            />
            <TouchableOpacity onPress={() => setQuery('')} activeOpacity={0.5} style={{ position: 'absolute', right: 15, top: 10, backgroundColor: '#fe7743', padding: 10, borderRadius: 10 }}><Text style={{ color: 'white' }}>X</Text></TouchableOpacity>
            {suggestions.length > 0 && (
                <FlatList
                    data={suggestions}
                    keyExtractor={(item) => item.place_id}
                    renderItem={renderItem}
                    style={styles.suggestionsList}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 0,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 5,
    },
    suggestionsList: {
        maxHeight: 200,
        borderWidth: 0,
        borderColor: 'gray',
        borderRadius: 5,
    },
    suggestion: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
});

export default GooglePlacesInput;