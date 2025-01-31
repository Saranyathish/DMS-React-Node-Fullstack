import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { Country, State, City } from 'country-state-city';
import axios from 'axios';

const LocationCanvas = ({
    show,
    setAddSection,
    handleSubmit,
    handleOnChange,
    formData,
    editSection,
    handleEditOnChange,
    handleUpdate,
    formDataEdit,
    exportToExcel,
}) => {
    const [visible, setVisible] = useState(show);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [currencies, setCurrencies] = useState([]);


    useEffect(() => {
        setVisible(show);
    }, [show]);

    useEffect(() => {
        setCountries(Country.getAllCountries());
    }, []);

    useEffect(() => {
        // Fetch the currency list
        const fetchCurrencies = async () => {
            try {
                const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
                setCurrencies(Object.keys(response.data.rates));
            } catch (error) {
                console.error("Error fetching currencies:", error);
            }
        };
        fetchCurrencies();
    }, []);



    const handleCountryChange = (e) => {
        const countryCode = e.target.value;
        const selectedCountry = countries.find(country => country.isoCode === countryCode);
        if (selectedCountry) {
            setStates(State.getStatesOfCountry(countryCode));
            handleOnChange({ target: { name: 'country', value: selectedCountry.name } });
            handleOnChange({ target: { name: 'countryCode', value: countryCode } });
        } else {
            setStates([]);
            handleOnChange({ target: { name: 'country', value: '' } });
            handleOnChange({ target: { name: 'countryCode', value: '' } });
        }
        setCities([]);
    };

    const handleStateChange = (e) => {
        const stateCode = e.target.value;
        const selectedState = states.find(state => state.isoCode === stateCode);
        const countryCode = editSection ? formDataEdit.countryCode : formData.countryCode;
        if (selectedState) {
            setCities(City.getCitiesOfState(countryCode, stateCode));
            handleOnChange({ target: { name: 'province', value: selectedState.name } });
            handleOnChange({ target: { name: 'stateCode', value: stateCode } });
        } else {
            setCities([]);
            handleOnChange({ target: { name: 'province', value: '' } });
            handleOnChange({ target: { name: 'stateCode', value: '' } });
        }
    };

    const handleCityChange = (e) => {
        const cityName = e.target.value;
        handleOnChange({ target: { name: 'city', value: cityName } });
    };

    const toggleShow = () => {
        const newVisibility = !visible;
        setVisible(newVisibility);
        setAddSection(!newVisibility);
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Location List</h2>

                <Button
                    variant="primary"
                    onClick={toggleShow}
                    style={{ backgroundColor: '#4d7c8a', marginLeft:'950px' }} // Added margin to the right
                >
                    Add Location List
                </Button>
                <Button
                    variant="secondary"
                    onClick={exportToExcel}
                    style={{ backgroundColor: '#4d7c8a', marginRight: '20px' }}
                >
                    Export to Excel
                </Button>

            </div>
            <Offcanvas show={visible} onHide={toggleShow} style={{ width: "80%" }}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                        {editSection ? "Edit Location" : "Add Location"}
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <hr />
                <Offcanvas.Body>
                    <Form onSubmit={editSection ? handleUpdate : handleSubmit}>
                        <Row>
                            <Col md={4}>
                                <FormGroup>
                                    <Label for="Lcode">Location Code *</Label>
                                    <Input
                                        id="Lcode"
                                        name="Lcode"
                                        type="text"
                                        value={editSection ? formDataEdit.Lcode : formData.Lcode}
                                        onChange={editSection ? handleEditOnChange : handleOnChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="country">Country</Label>
                                    <Input
                                        id="country"
                                        name="country"
                                        type="select"
                                        value={editSection ? formDataEdit.countryCode : formData.countryCode}
                                        onChange={handleCountryChange}
                                    >
                                        <option value="">Select Country</option>
                                        {countries.map(country => (
                                            <option key={country.isoCode} value={country.isoCode}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </Input>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="subdistrict">Sub-District</Label>
                                    <Input
                                        id="subdistrict"
                                        name="subdistrict"
                                        type="text"
                                        value={editSection ? formDataEdit.subdistrict : formData.subdistrict}
                                        onChange={editSection ? handleEditOnChange : handleOnChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="Cnumber">Contact Number</Label>
                                    <Input
                                        id="Cnumber"
                                        name="Cnumber"
                                        type="text"
                                        value={editSection ? formDataEdit.Cnumber : formData.Cnumber}
                                        onChange={editSection ? handleEditOnChange : handleOnChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="remarks">Remarks</Label>
                                    <Input
                                        id="remarks"
                                        name="remarks"
                                        type="textarea"
                                        value={editSection ? formDataEdit.remarks : formData.remarks}
                                        onChange={editSection ? handleEditOnChange : handleOnChange}
                                    />
                                </FormGroup>

                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <Label for="Lname">Location Name</Label>
                                    <Input
                                        id="Lname"
                                        name="Lname"
                                        type="text"
                                        value={editSection ? formDataEdit.Lname : formData.Lname}
                                        onChange={editSection ? handleEditOnChange : handleOnChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="province">Province</Label>
                                    <Input
                                        id="province"
                                        name="province"
                                        type="select"
                                        value={editSection ? formDataEdit.stateCode : formData.stateCode}
                                        onChange={handleStateChange}
                                    >
                                        <option value="">Select Province</option>
                                        {states.map(state => (
                                            <option key={state.isoCode} value={state.isoCode}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </Input>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="Pcode">Postal Code</Label>
                                    <Input
                                        id="Pcode"
                                        name="Pcode"
                                        type="text"
                                        value={editSection ? formDataEdit.Pcode : formData.Pcode}
                                        onChange={editSection ? handleEditOnChange : handleOnChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="fax">Fax</Label>
                                    <Input
                                        id="fax"
                                        name="fax"
                                        type="text"
                                        value={editSection ? formDataEdit.fax : formData.fax}
                                        onChange={editSection ? handleEditOnChange : handleOnChange}
                                    />
                                </FormGroup>
                                <FormGroup check>
                                    <Label check>
                                        <Input
                                            type="checkbox"
                                            name="Active"
                                            checked={editSection ? formDataEdit.Active : formData.Active}
                                            onChange={editSection ? handleEditOnChange : handleOnChange}
                                        />
                                        Active
                                    </Label>
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                            <FormGroup>
                                    <Label for="address">Address</Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        type="text"
                                        value={editSection ? formDataEdit.address : formData.address}
                                        onChange={editSection ? handleEditOnChange : handleOnChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="city">City/District</Label>
                                    <Input
                                        id="city"
                                        name="city"
                                        type="select"
                                        value={editSection ? formDataEdit.city : formData.city}
                                        onChange={handleCityChange}
                                    >
                                        <option value="">Select City/District</option>
                                        {cities.map(city => (
                                            <option key={city.name} value={city.name}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </Input>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="Cperson">Contact Person</Label>
                                    <Input
                                        id="Cperson"
                                        name="Cperson"
                                        type="text"
                                        value={editSection ? formDataEdit.Cperson : formData.Cperson}
                                        onChange={editSection ? handleEditOnChange : handleOnChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={editSection ? formDataEdit.email : formData.email}
                                        onChange={editSection ? handleEditOnChange : handleOnChange}
                                    />
                                </FormGroup>
                               

                            </Col>
                        </Row>
                        <div style={{ marginLeft: "500px" }} >
                            <Button type="submit" style={{ marginTop: '15px', backgroundColor: '#4d7c8a' }}>
                                {editSection ? "Update Location " : "Add Location"}
                            </Button>
                            <Button type="button"
                                onClick={toggleShow}
                                style={{ marginTop: '15px', backgroundColor: 'red' }}>
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default LocationCanvas;