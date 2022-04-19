import './App.css';
import Axios from 'axios';
import { useState, useEffect } from 'react';
import { Autocomplete, TextField, IconButton } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import HomeIcon from '@mui/icons-material/Home';




function App() {

  const [list, setList] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [savedInterval, setSavedInterval] = useState(null)
  const [isHover, setIsHover] = useState(false);
  const [mainCity, setMainCity] = useState(null);
  const [clicked, setClicked] = useState(-1);





  useEffect(() => {
    Axios({
      url: "http://worldtimeapi.org/api/timezone",
    })
      .then((response) => {
        setList(response.data.map(x => { return { label: x }; }));
      })
      .catch((error) => {
        console.log(error);
      });


  }, [setList]);

  const addCity = (city) => {
    Axios({
      url: `http://worldtimeapi.org/api/timezone/${city} `,
    })
      .then((response) => {
        setSelectedCities([...selectedCities, response.data])

      })
      .catch((error) => {
        console.log(error);
      });


  }

  const getData = (city) => {
    Axios({
      url: `http://worldtimeapi.org/api/timezone/${city} `,
    })
      .then((response) => {
        //  const utcParse=parseInt(response.data.utc_offset.substring(0,3))
        //   let dateTimeObject=new Date(response.data.datetime.substring(0,19))
        setMainCity(response.data)


      })
      .catch((error) => {
        console.log(error);
      });

  }

  const deleteCity = (index) => {
    if (index === 0 && selectedCities.length > 1) {
      clearInterval(savedInterval);
      getData(selectedCities[1].timezone, true);
      const saveInter = setInterval(() => getData(selectedCities[1].timezone, false), 1000);
      setSavedInterval(saveInter);

    }

    let tempCities = [];
    for (var i = 0; i < selectedCities.length; i++) {
      if (i !== index) {
        tempCities.push(selectedCities[i])
      }
    }
    setSelectedCities(tempCities)

    console.log(index)

  }

  const parseUtc = (city) => {
    return parseInt(city.utc_offset.substring(0, 3))
  }
  const parseDateTime = (city) => {
    const cityDate = new Date(city.datetime.substring(0, 19))
    return cityDate
  }
  const addHours = (city, hours) => {
    const dateCity = parseDateTime(city)
    dateCity.setHours(dateCity.getHours() + hours)
    return dateCity

  }
  const getTime = (datetimeobj) => {
    return datetimeobj.getHours() + ' : ' + datetimeobj.getMinutes()
  }



  const RowTimeZone = (Props) => {
    const { index, cities, mainCity, deleteCity, clicked } = Props;
    const diff = parseUtc(cities[index]) - parseUtc(cities[0])
    //const [city,setCity]=useState(cities[index])  
    const city = cities[index]

    //const [diff,setDiff]=useState(tempDiff);

    const arrayHours = Array(24)
      .fill()
      .map((_, i) =>

        addHours(mainCity, diff + i - 1)


      )
    //const [arrayHours,setArrayHours]=useState(Ar)






    const formatHours = (hour) => {
      return hour < 13 ? hour : hour - 12;
    }
    const formatAmOrPm = (hour) => {
      return hour < 12 ? 'a.m' : 'p.m';

    }


    const getHourDifference = (hour) => {
      let newHour = new Date();
      newHour.setHours(hour.getHours() + 1);

      return formatHours(hour.getHours()) + " " + formatAmOrPm(hour.getHours()) + "-" +
        formatHours(newHour.getHours()) + " " + formatAmOrPm(newHour.getHours())
    }


    return <div className='horizon'>

      <div style={{ width: '3%', zIndex: 100 }} >
        <IconButton onClick={() => deleteCity(index)} >
          <DeleteIcon />
        </IconButton>
      </div>

      <div style={{ width: '2%' }} >
        {index !== 0 ? diff : <HomeIcon />}
      </div>
      <div style={{ width: '15%', fontSize: "2vh" }} >
        {city.timezone

        }
      </div>

      <div style={{ width: '10%', fontSize: "2vh" }} >
        {
          clicked === -1 ?
            <div>
              <div>
                {
                  getTime(addHours(mainCity, diff)) + " " + city.abbreviation
                }
              </div>
              <div>
                {
                  addHours(mainCity, diff).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
                }
              </div>
            </div>


            : getHourDifference(arrayHours[clicked])

        }
      </div>

      {
        arrayHours
          .map(h =>
            <div style={{
              background: h.getHours() > 20 || h.getHours() < 6 ? 'black'
                :
                h.getHours() === 6 || h.getHours() === 7 || (h.getHours() > 17 && h.getHours() < 21) ?
                  'lightblue'
                  :
                  'white'
              ,
              color: h.getHours() > 20 || h.getHours() < 6 ? 'white' : 'black',
              width: '3%',
              marginTop: '3px',
              fontSize: '2vh',
              zIndex: "-100"

            }} >
              {
                h.getHours() > 0 ?
                  <div>
                    <div>
                      {
                        formatHours(h.getHours())
                      }
                    </div>
                    <div>
                      {
                        formatAmOrPm(h.getHours())
                      }
                    </div>
                  </div>

                  :
                  <div>
                    <div>
                      {
                        h.toLocaleString('default', { month: 'short' })
                      }
                    </div>
                    <div>
                      {
                        h.getDate()
                      }
                    </div>
                  </div>

              }
            </div>


          )
      }
    </div>


  }

  const onChange = (event, value) => {
    console.log(value)
    if (selectedCities.length < 1) {
      // setMainCity(value.label)
      getData(value.label, true);
      const saveInter = setInterval(() => getData(value.label, false), 1000)
      setSavedInterval(saveInter);
    }
    addCity(value.label);
    // setSelectedCity(null)

  }
  const handleMouseEnter = e => {
    e.target.style.border = "solid"
    e.target.style.borderColor = "green"
    e.target.style.background = "lightgreen"
    e.target.style.opacity = 0.5
    setIsHover(true)
    console.log(e._targetInst.key)
  }
  const handleMouseLeave = e => {
    e.target.style.border = "none"
    e.target.style.borderColor = "none"
    e.target.style.background = "none"
    e.target.style.opacity = 0.5
    setClicked(-1);
    setIsHover(false)

  }


  return (
    <div className="App">
      {<div style={{ margin: '20px', width: '20%' }}>
        <Autocomplete

          id="combo-box-cities"
          size='small'

          value={null}
          onChange={onChange}
          options={list}

          renderInput={(params) => <TextField {...params} sx={{ fontSize: '2vh' }} label="Select a city" />}
        />
      </div>}


      <div id="wrapper">



        <div className="content">
          <div className='horizon2'>
            <div style={{ width: '3%' }} />
            <div style={{ width: '2%' }} />
            <div style={{ width: '15%' }} />
            <div style={{ width: '10%' }} />


            {Array(24)
              .fill()
              .map((_, i) =>
                <div
                  key={i}
                  onClick={() => setClicked(i)}
                  style={
                    i === 1 && !isHover
                      ?
                      {
                        width: '3%',
                        border: "solid",
                        borderColor: "green",
                        background: "lightgreen",
                        opacity: 0.5

                      }

                      :
                      {
                        width: '3%',

                      }
                  }
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}

                >
                </div>


              )
            }
          </div>
        </div>

        <div className="background">
          {
            Array(selectedCities.length)
              .fill()
              .map((_, i) =>
                <RowTimeZone
                  key={i}
                  clicked={clicked}
                  index={i}
                  deleteCity={deleteCity}
                  cities={selectedCities}
                  mainCity={mainCity}

                />)
          }



        </div>



      </div>
    </div>
  );
}

export default App;
