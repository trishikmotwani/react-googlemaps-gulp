import * as React from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';
import './MapComponent.css';
import { USLocationData } from '../model/UsZipcodesAndLocations';

export class MapComponent extends React.Component {
 
    constructor(props) {
        super(props);
        // setting initial state
        this.state = {
            zoomLevel: 14,
            latitude: undefined,	
            longitude: undefined,
            markerLongitude: undefined,
            markerLatitude: undefined,
            apiKey: 'AIzaSyDF78VXFaU7U8tSpXOVqmNhDrJ7oW_R5OA',
            useDefaultUI: false,
            googleMapsMarkerIcon: this.props.google.maps.SymbolPath.CIRCLE,
            mapStyle: {
                width: '75%',
                height: '100%'
            },
            zipcode: undefined,
            showInfoWindow: false,
            activeMarker: {},
            city: ''
        }
    }

    onZipSearchResultSelect  = (e, selectedData) => {
        console.log('selected data is - ', selectedData);
        this.setState({
            latitude: selectedData.fields.latitude,
            longitude: selectedData.fields.longitude,
            markerLatitude: selectedData.fields.latitude,
            markerLongitude: selectedData.fields.longitude,
            zipcode: selectedData.fields.zip,
            googleMapsMarkerIcon: this.props.google.maps.SymbolPath.CIRCLE,
            city: selectedData.fields.city,
        });
        
    }
    renderLocationTable = () => {
        console.log('render All/Search results location Table');
        console.log('zipcode',this.state.zipcode);
        return (
            <table id="results-table">
                <thead>
                    <th>ZipCode</th>
                    <th>State</th>
                    <th>City</th>
                </thead>
                <tbody>
                    {USLocationData.map((data,i) => {
                            if(data.fields.zip.indexOf(this.state.zipcode) > -1 ||
                                this.state.zipcode === undefined) {
                                    return <tr 
                                        onClick={(e) => this.onZipSearchResultSelect(e,data)} 
                                        key={i}
                                        className={this.state.zipcode === data.fields.zip ? 'selected-row' : undefined}
                                    >
                                        <td>{data.fields.zip}</td>
                                        <td>{data.fields.state}</td>
                                        <td>{data.fields.city}</td>
                                    </tr>
                            }
                        })
                    }
                </tbody>
            </table>

        )

    }
    onMarkerClick = (pros, marker , e) => {
        this.setState({
            showInfoWindow: true,
            activeMarker: marker,
        })
    }

    onInfoWindowClose = () => {
        this.setState({
            showInfoWindow: false,
            activeMarker: undefined
        })
    }
    componentDidMount() {
        navigator.geolocation.getCurrentPosition((position) => {
        console.log("current Latitude is :", position.coords.latitude);
        console.log("current Longitude is :", position.coords.longitude);
            this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                markerLatitude: position.coords.latitude,
                markerLongitude: position.coords.longitude,
                googleMapsMarkerIcon: "Current Location"
            });
        });
        
    }

    render() {

        console.log('MapComponent props' , this.props);
        
        return (
            <div className="maps-container">
                <div className="maps-search-container-div">
                    <div className="maps-search-div">
                        <label>Search By Zipcode/Select from Table</label>
                        <input 
                            class="search-input"
                            onChange={(e) => {
                                console.log(e.target.value);
                                this.setState({
                                    zipcode: e.target.value,
                                });
                            }}
                            value={this.state.zipcode}
                            placeholder="zipcode"
                        />
                    </div>
                    <div className="search-results-div"> 
                        {this.renderLocationTable()}
                    </div>
                </div>

                {this.state.latitude && this.state.longitude &&
                    <div className="maps-div">
                        <Map
                            google={this.props.google}
                            zoom={this.state.zoomLevel}
                            style={this.state.mapStyle}
                            initialCenter={
                                {   
                                    lat: this.state.latitude,
                                    lng: this.state.longitude
                                }
                            }
                            disableDefaultUI={this.state.useDefaultUI}
                            center={
                                {   
                                    lat: this.state.latitude,
                                    lng: this.state.longitude
                                }
                            }
                        >
                            <Marker
                                onClick={this.onMarkerClick}
                                position={{ lat: this.state.markerLatitude, lng: this.state.markerLongitude }}
                                icon={this.state.googleMapsMarkerIcon}
                            />
                            <InfoWindow
                                marker={this.state.activeMarker}
                                visible={this.state.showInfoWindow}
                                onClose={this.onInfoWindowClose}
                            >
                                <div>
                                    <h2>{this.state.city}</h2>
                                </div>
                            </InfoWindow>
                        </Map>
                    </div>
                }
            </div>
            
        );
    }
}

export default GoogleApiWrapper(
    (props) => ({
        apiKey: 'AIzaSyDF78VXFaU7U8tSpXOVqmNhDrJ7oW_R5OA'
    })
)(MapComponent);