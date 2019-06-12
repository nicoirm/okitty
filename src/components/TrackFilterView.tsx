import React, {Component} from 'react';
import 'ol/ol.css';
import './MapComponent.css';
import {TrackLayer} from "../store/modelTypes";
import {Box} from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {getMapViewTrackLayers} from "../store/mapView/mapViewSelector";
import {State} from "../store/rootReducer";
import {connect} from "react-redux";
import './TrackFilterView.css';
import {ActionTypes} from "../store/actionTypes";
import {ThunkDispatch} from "redux-thunk";
import {updateDateRange} from "../store/actions";
import DateRangePicker from "./DateRangePicker";


interface TrackFilterMappedProps {
    trackLayers: Array<TrackLayer>
}

interface TrackFilterDispatchProps {
    updateDateRange: (index: number, fromDate: string, toDate: string) => any,
}

type  TrackFilterProps = TrackFilterMappedProps & TrackFilterDispatchProps

class TrackFilterView extends Component<TrackFilterProps> {

    handleDateRangeChange = (index: number) => (fromDate: string, toDate: string) => {
        this.props.updateDateRange(index, fromDate, toDate);
    };

    render() {
        return this.props.trackLayers.map((trackLayer, trackLayerIndex) =>
            <Box key={trackLayerIndex}>
                <div>Track group {trackLayerIndex}</div>
                <DateRangePicker
                    fromDate={trackLayer.fromDate}
                    toDate={trackLayer.toDate}
                    onChange={this.handleDateRangeChange(trackLayerIndex)}
                />
                <List component="nav">
                    {trackLayer.tracks.map((track, trackIndex) =>
                        <ListItem key={trackIndex}>
                            <ListItemText primary={`${track.device.user} / ${track.device.device}`}/>
                        </ListItem>)
                    }
                </List>
            </Box>
        );
    }
}

export default connect((state: State): TrackFilterMappedProps => ({
    trackLayers: getMapViewTrackLayers(state),
}), (dispatch: ThunkDispatch<State, void, ActionTypes>): TrackFilterDispatchProps => ({
    updateDateRange: (index: number, fromDate: string, toDate: string) => dispatch(updateDateRange(index, fromDate, toDate)),
}))(TrackFilterView)