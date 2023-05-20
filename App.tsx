/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from "react";
import { StyleSheet, View } from "react-native";
import Mapbox from "@rnmapbox/maps";

const features = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            id: "a-feature",
            properties: {
                icon: "example",
                text: "example-icon-and-label",
            },
            geometry: {
                type: "Point",
                coordinates: [2.548828100070267, 11.716788276964309],
            },
        },
        {
            type: "Feature",
            id: "b-feature",
            properties: {
                text: "just-label",
            },
            geometry: {
                type: "Point",
                coordinates: [-1.2634277220050762, 7.199000653649819],
            },
        },
        {
            type: "Feature",
            id: "c-feature",
            properties: {
                icon: "example",
            },
            geometry: {
                type: "Point",
                coordinates: [3.617628692102244, 7.505671715388999],
            },
        },
    ],
};

function App(): JSX.Element {
    return (
        <View style={styles.container}>
            <Mapbox.MapView
                style={styles.map}
                onPress={props => {
                    console.log(props);
                }}
            >
                <Cluster />
            </Mapbox.MapView>
        </View>
    );
}

const mag1 = ["<", ["get", "mag"], 2];
const mag2 = ["all", [">=", ["get", "mag"], 2], ["<", ["get", "mag"], 3]];
const mag3 = ["all", [">=", ["get", "mag"], 3], ["<", ["get", "mag"], 4]];
const mag4 = ["all", [">=", ["get", "mag"], 4], ["<", ["get", "mag"], 5]];
const mag5 = [">=", ["get", "mag"], 5];

function Cluster() {
    const circleLayerStyle = {
        circleRadiusTransition: { duration: 5000, delay: 0 },
        circleColor: "#ff0000",
    };

    return (
        <Mapbox.ShapeSource
            id={"shape-source-id-0"}
            shape={features}
            cluster={true}
            clusterRadius={50}
            clusterMaxZoomLevel={14}
            clusterProperties={{
                mag1: [
                    ["+", ["accumulated"], ["get", "mag1"]],
                    ["case", mag1, 1, 0],
                ],
                mag2: [
                    ["+", ["accumulated"], ["get", "mag2"]],
                    ["case", mag2, 1, 0],
                ],
                mag3: [
                    ["+", ["accumulated"], ["get", "mag3"]],
                    ["case", mag3, 1, 0],
                ],
                mag4: [
                    ["+", ["accumulated"], ["get", "mag4"]],
                    ["case", mag4, 1, 0],
                ],
                mag5: [
                    ["+", ["accumulated"], ["get", "mag5"]],
                    ["case", mag5, 1, 0],
                ],
            }}
        >
            <Mapbox.CircleLayer id={"circle-layer"} style={circleLayerStyle} />
        </Mapbox.ShapeSource>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
});

export default App;
