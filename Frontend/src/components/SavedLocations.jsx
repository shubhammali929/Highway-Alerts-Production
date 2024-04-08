import React, { useState, useEffect } from 'react';
import { useMyContext } from '../context/MyContext';

export default function SavedLocations() {
  const [savedLocations, setSavedLocations] = useState([]);
  const { userData } = useMyContext();
  const {BASE_URL} = useMyContext();
  useEffect(() => {
    const fetchSavedLocations = async () => {
      try {
        const response = await fetch(`${BASE_URL}/user/favorite-places?userEmail=${userData.email}`);
        const data = await response.json();
        console.log(data)
        if (response.ok) {
          setSavedLocations(data.savedLocations);
        } else {
          console.error('Failed to fetch saved locations:', data.error);
        }
      } catch (error) {
        console.error('Error fetching saved locations:', error);
      }
    };

    fetchSavedLocations();
  }, [userData.email]);


  return (
    <div>

      <div className="card">
        <div className="card-header">
          <h2>Saved Locations</h2>
        </div>
        <div className="card-body">
          <ul style={{"listStyleType": "none", "paddingLeft": "0px"}}>
            {savedLocations.map((location, index) => (
              <li key={index}>
                <div className="card mb-3">
                  <div className="card-body">
                    <h5 className="card-title">Name : {location.name}</h5>
                    <p className="card-text"><span>Address :</span> {location.vicinity}</p>
                    <a href="#" className="btn btn-primary mx-2"><i class="fas fa-location-arrow"></i>Navigate</a>
                    <a href="#" className="btn btn-danger"><i class="fas fa-trash-alt"></i> Remove</a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
}
