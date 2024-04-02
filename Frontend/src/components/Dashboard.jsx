import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [range, setRange] = useState('');
  const [rating, setRating] = useState('');
  const [locations, setLocations] = useState([]);
  const [userData, setUserData] = useState(null);
  const [greeting, setGreeting] = useState('');
  const BASE_URL = "https://highway-alerts.onrender.com";
  const [dropdownOptions, setDropdownOptions] = useState([
    'restaurant',
    'hospital',
    'park',
    'parking',
    'shopping_mall',
    'cafe',
    'gas_station',
  ]);

  useEffect(()=>{
    fetch(`${BASE_URL}/userData`,{
        method:"POST",
        crossDomain:true,
        headers:{
            "Content-Type": "application/json", 
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        body:JSON.stringify({
            token:window.localStorage.getItem("token"),
        }),
    }).then((res) => res.json())
    .then((data) =>{
        console.log(data.data,); 
        setUserData(data.data);
    });



    //greeting code
    const hour = new Date().getHours();
    setGreeting(
      hour >= 5 && hour < 12 ? 'Good Morning' :
      hour >= 12 && hour < 18 ? 'Good Afternoon' :
      'Good Evening'
    );
  },[])

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleAddLocation = () => {
    if (selectedCategory && range && rating) {
      const newLocation = {
        category: selectedCategory,
        range,
        rating,
      };
      setLocations([...locations, newLocation]);
      // Clear the input fields after adding a location
      setSelectedCategory('');
      setRange('');
      setRating('');
    } else {
      // Display an error or alert for incomplete inputs
      alert('Please fill in all fields');
    }
  };

  const handleDeleteLocation = (index) => {
    const updatedLocations = [...locations];
    const deletedLocation = updatedLocations.splice(index, 1)[0];
    setLocations(updatedLocations);

    // Add the deleted category back to dropdown options
    setDropdownOptions((options) => [...options, deletedLocation.category]);
  };

  const handleSubmit = () => {
    // Pass the locations state variable to MyComponent
    navigate('/mycomponent', { state: { locations } });
  };

  return (
    <div className="Dashboard v-flex"> 
    <div className="greet">{userData && userData.name ? `${greeting} ${userData.name}` : 'Loading...'}</div>
      <div className="main">
        <Link to="/SavedLocations" ><button className='btnGreen' >View Saved Locations</button></Link>
      <div className="v-flex user-input">
        <select name="category" id="category" onChange={handleCategoryChange} value={selectedCategory}>
          <option value="">Select Category</option>
          {dropdownOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <input type="text" className="" placeholder="Range" value={range} onChange={(e) => setRange(e.target.value)}/>
        <input type="text" className="" id="" placeholder="Enter rating 0-5" value={rating} onChange={(e) => setRating(e.target.value)}/>
        <button type="button" className="add" onClick={handleAddLocation}> Add </button>
      </div>
      
      <div className="v-flex added-locations">
        {locations.map((location, index) => (
          <div className="added-location" key={index}>
            <div>{location.category}</div>
            <div>{location.range}</div>
            <div>{location.rating}</div>
            <div><button type="button" className="delete" onClick={() => handleDeleteLocation(index)}> Delete </button></div>
          </div>
          
        ))}
      </div>
      <div className="container">
        <button type="button" className="submit btnBlue" onClick={handleSubmit}>Submit</button>
      </div>
      </div>
    </div>
  );
}