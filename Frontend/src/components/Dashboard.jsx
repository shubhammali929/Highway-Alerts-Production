import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMyContext } from '../context/MyContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [range, setRange] = useState('');
  const [rating, setRating] = useState('');
  const [locations, setLocations] = useState([]);
  const {userData, setUserData} = useMyContext();

  // const [greeting, setGreeting] = useState('');
  const {BASE_URL} = useMyContext();
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



    // //greeting code
    // const hour = new Date().getHours();
    // setGreeting(
    //   hour >= 5 && hour < 12 ? 'Good Morning' :
    //   hour >= 12 && hour < 18 ? 'Good Afternoon' :
    //   'Good Evening'
    // );
  },[])

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

const handleAddLocation = () => {
  if (selectedCategory && range>1 && rating >= 0 && rating <= 5) {
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
    // Display an error or alert for incomplete or invalid inputs
    toast.warn('Please fill in all fields and ensure rating is between 0 and 5, and range is greater than 1', {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
  });
    // alert('Please fill in all fields and ensure rating is between 0 and 5, and range is greater than 1');
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
    {/* <div className="greet">{userData && userData.name ? `${greeting} ${userData.name}` : 'Loading...'}</div> */}
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
        <input
  type="number"
  className=""
  max="10"
  placeholder="Enter Range in Kms."
  value={range}
  onChange={(e) => setRange(e.target.value)}
/>
<input
  type="number"
  className=""
  id=""
  placeholder="Enter rating 0-5"
  value={rating}
  onChange={(e) => setRating(e.target.value)}
  min="0"
  max="5"
/>

        <button type="button" className="add" onClick={handleAddLocation}> Add </button>
        <hr />
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