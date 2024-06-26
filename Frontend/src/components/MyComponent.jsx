import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import Animation from './Animation';
import { useMyContext } from '../context/MyContext';
// import response from '../components/response.json';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const containerStyle = {
  width: '90vw',
  height: '65vh',
  borderRadius: '20px',
  border: '2px solid gray'
};

function MyComponent() {
  // const map,isProcessingNextLocation, setIsProcessingNextLocation,speechInputText,
  const { setMap, locationQueue, setLocationQueue, restaurant, setRestaurants, gyms, setGyms, park, setParks, hospital, setHospitals, parking, setParkings, cafe, setCafes, shopping_mall, setShopping_malls, gas_station, setGas_stations, userLocation, setUserLocation, selectedMarker, setSelectedMarker, animation, setAnimation, setSpeechInputText, currLocationName, setCurrLocationName,userData, setUserData } = useMyContext();
  const location = useLocation();
  const [isSpeechPaused, setIsSpeechPaused] = useState(false);
  const [spokenLocation, setSpokenLocation] = useState(null);
  const submittedData = location.state?.locations || [];
  const [isSaved, setIsSaved] = useState(false);
  const {BASE_URL} = useMyContext();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_MAP_API_KEY
  });

  const clearUtterance = () => {
    window.speechSynthesis.cancel(); // Stop all utterances
    setSpokenLocation(null); // Clear spoken location
    setLocationQueue([]); // Clear location queue
  };
  
  const handleSaveClick = async () => {
    setIsSaved(!isSaved);
    console.log("Starting to save location ...");

    if (!spokenLocation) return; // Make sure a location is spoken

    // console.log("Saving location ...", userData.email);
    // console.log("User email: " + userData.email);
    // console.log("Place name: " + spokenLocation.name);
    // console.log("Address: " + spokenLocation.vicinity);
    // console.log("Coordinates: " + spokenLocation.geometry.location.lat + "," + spokenLocation.geometry.location.lng);
    // console.log("Place ID: " + spokenLocation.place_id);

    try {
        const response = await fetch(`${BASE_URL}/user/favorite-place`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: userData.email, // User's email
                savedLocation: {
                    name: spokenLocation.name,
                    vicinity: spokenLocation.vicinity,
                    lat: spokenLocation.geometry.location.lat,
                    lng: spokenLocation.geometry.location.lng,
                    place_id: spokenLocation.place_id
                }
            }),
        });
        const data = await response.json();
        console.log('Response:', data); // Log the response for debugging
        if (response.ok) {
            alert("Favorite place added successfully")
            // console.log('Favorite place added successfully:', data);
            toast.success('Location Saved', {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
          });
            setIsSaved(true);
        } else {
            console.error('Failed to add favorite place:', data.error);
        }
    } catch (error) {
        console.error('Error adding favorite place:', error);
    }
};

  const convertToSpeech = async (text) => {
    return new Promise((resolve) => {
      console.log('convertToSpeech start');
      setAnimation('speaking');
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = window.speechSynthesis.getVoices()[1];

      utterance.onend = () => {
        console.log('convertToSpeech end');
        setAnimation(null);
        setSpokenLocation(null);
        resolve(); // Resolve the promise after speech ends
      };
      window.speechSynthesis.speak(utterance);
    });
  };

  const toggleSpeech = () => {
    if (isSpeechPaused) {
      window.speechSynthesis.resume(); // Resume speech
      setAnimation('speaking');
    } else {
      window.speechSynthesis.pause(); // Pause speech
      setAnimation(null);
    }
    // Toggle the state variable
    setIsSpeechPaused(!isSpeechPaused);
  };

  const listenToUser = async (name) => {
    return new Promise(async (resolve) => {
      setSpeechInputText("");
      setAnimation('listening');
      console.log("listening started");
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.interimResults = true;

      let transcript = "";

      recognition.addEventListener('result', (e) => {
        transcript = Array.from(e.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        setSpeechInputText(transcript);
        console.log(transcript);
      });

      recognition.addEventListener('end', async () => {
        setAnimation(null);
        console.log("listening stopped!!!");

        const lowercasedInput = transcript.toLowerCase();
        console.log("speechInputText ->", transcript);
        console.log(`loweredCase--> ${lowercasedInput}`);

        if (lowercasedInput.includes("yes")) {
          await convertToSpeech(`You will now be redirected to the map with location ${name}`);
          window.location.href = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${name}&travelmode=Driving`;
          setLocationQueue([]);
        } else if (lowercasedInput.includes("no")) {
          await convertToSpeech(`Moving to the Next Location`);
          resolve();
        } else {
          await convertToSpeech(`We could not hear the right command from you. Please say yes to set this location on the map or no to skip this location`);
          await listenToUser(); // Listen again
        }

        resolve();
      });

      recognition.start();
    });
  };

  const renderMarkers = (locations, onClickCallback) => {

    return locations.map((location) => {
      // Find the corresponding submitted data for this location
      const matchingData = submittedData.find((data) => data.category === location.types[0]);
      // Add a condition to check if the rating is greater than or equal to matchingData.rating
      return matchingData && location.rating >= matchingData.rating && (
        <Marker
          key={location.name}
          position={{
            lat: location.geometry.location.lat,
            lng: location.geometry.location.lng,
          }}
          onClick={() => onClickCallback(location)}
        />
      );
    });
  };

  useEffect(() => {
    processLocationQueue();
  }, [locationQueue]);

  const processLocationQueue = async () => {
    if (locationQueue.length > 0) {
      const { name, distance, rating } = locationQueue[0];
      setSpokenLocation(locationQueue[0]);
      console.log(`There is ${name} at the distance of ${distance.toFixed(2)} km having a rating of ${rating} stars`);
      await convertToSpeech(`There is ${name} at the distance of ${distance.toFixed(2)} km having a rating of ${rating} stars, do you want to add this location to your map?`);
      setCurrLocationName(name);

      await listenToUser(name); // Wait for user response


      setLocationQueue((prevQueue) => prevQueue.slice(1));
    }
  };


  const calculateDistance = (point1, point2) => {// Helper function to calculate distance between two points
    const lat1 = point1.lat;
    const lon1 = point1.lng;
    const lat2 = point2.lat;
    const lon2 = point2.lng;

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers

    return distance;
  };

  const fetchNearbyLocations = async (location, radius, keyword, rating) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/places?location=${location.lat},${location.lng}&radius=${radius}&keyword=${keyword}&key=${process.env.REACT_APP_PLACES_AND_MAP_API_KEY}`
      )
      console.log(response);
      const data = await response.json();
      // const data = response;
      console.log(`Fetched locations of type ${keyword} -->>`, data);

      if (keyword === 'restaurant') {
        setRestaurants(data.results);
      } else if (keyword === 'gyms') {
        setGyms(data.results);
      } else if (keyword === 'park') {
        setParks(data.results);
      } else if (keyword === 'hospital') {
        setHospitals(data.results);
      } else if (keyword === 'parking') {
        setParkings(data.results);
      } else if (keyword === 'cafe') {
        setCafes(data.results);
      } else if (keyword === 'shopping_mall') {
        setShopping_malls(data.results);
      } else if (keyword === 'gas_station') {
        setGas_stations(data.results);
      }

      // Update the locationQueue with the new locations
      setLocationQueue((prevQueue) => [
        ...prevQueue,
        ...data.results
          .filter((result) => result.geometry && result.geometry.location && result.rating >= rating)
          .map((result) => ({
            name: result.name,
            distance: calculateDistance(location, result.geometry.location),
            rating: result.rating || 'N/A',
            geometry: result.geometry,
            icon: result.icon,
            icon_background_color: result.icon_background_color,
            vicinity: result.vicinity,
            place_id: result.place_id,
          })),
      ]);
    } catch (error) {
      console.log('Error fetching nearby location make sure you have started server.js')
    }

  }

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          setUserLocation({ lat: userLat, lng: userLng });
          submittedData.forEach(element => {//ITERATING OVER SUBMITTED DATA AND CALLING fetchNearbyLocations
            fetchNearbyLocations({ lat: userLat, lng: userLng }, element.range * 1000, element.category, element.rating)
          });
        },
        (error) => console.error('Error getting user location:', error));
    } else {
      console.error('Geolocation is not supported by your browser');
    }
  };

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
    getUserLocation();
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  return isLoaded ? (
    <div className='map'>
      <div className="heading">
        Welcome To Highway Alerts
      </div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation || { lat: -3.745, lng: -38.523 }}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {renderMarkers(restaurant, handleMarkerClick)}
        {renderMarkers(gyms, handleMarkerClick)}
        {renderMarkers(park, handleMarkerClick)}
        {renderMarkers(hospital, handleMarkerClick)}
        {renderMarkers(parking, handleMarkerClick)}
        {renderMarkers(cafe, handleMarkerClick)}
        {renderMarkers(shopping_mall, handleMarkerClick)}
        {renderMarkers(gas_station, handleMarkerClick)}

        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: 'https://cdn-icons-png.flaticon.com/128/1783/1783356.png',
              scaledSize: new window.google.maps.Size(30, 30),
            }}
          />
        )}

        {spokenLocation && (

          <InfoWindow
            position={{
              lat: spokenLocation.geometry.location.lat,
              lng: spokenLocation.geometry.location.lng,
            }}
            onCloseClick={() => setSpokenLocation(null)}
          >
            <div style={{ fontSize: '10px', maxWidth: '200px' }}>
              <h3 style={{ fontSize: '13px', margin: '0 0 1px' }}>{spokenLocation.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                <img src={spokenLocation.icon} alt="" style={{ width: '20%', height: '20%', marginRight: '5px', backgroundColor: spokenLocation.icon_background_color, padding: '10px', borderRadius: '5px' }} />
                <p>{spokenLocation.vicinity}</p>
              </div>
              <p>Rating: {spokenLocation.rating}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      <div className="bottom">
        <div className="vertical">
        
        <i onClick={handleSaveClick} className={`fa-bookmark ${isSaved ? 'fa-solid' : 'fa-regular'} ` }></i>

        <i onClick={toggleSpeech} className={`fa-solid ${isSpeechPaused ? 'fa-play' : 'fa-pause'}`}></i>
          {/* <img src="https://cdn-icons-png.flaticon.com/128/9068/9068771.png" alt="pause" onClick={toggleSpeech} /> */}
        </div>
        <Animation Animation={animation} />
        <div className="vertical">
          <div className="count">
          <i class="fa-solid fa-map"></i>
            <p>{locationQueue.length}</p>
          </div>
          <a href="/" onClick={clearUtterance}>
            <i class="fa-solid fa-right-from-bracket"></i>
          </a>

        </div>
      </div>
    </div>
  ) : <></>;
}

export default React.memo(MyComponent);
