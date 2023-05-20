/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from "react";
import { StyleSheet, View } from "react-native";
import { FeatureCollection } from "geojson";
import data from "./data.json";

import Mapbox from "@rnmapbox/maps";

Mapbox.setAccessToken("pk.eyJ1Ijoidml2aWRtYWNoaW5lcyIsImEiOiJjbDd0NmNmeXcwMm9hM3dvOTNjN3hlYmtjIn0.O6oE-WFPSEEW7k9w8ZklDg");

const layerStyles: {
    singlePoint: CircleLayerStyle;
    clusteredPoints: CircleLayerStyle;
    clusterCount: SymbolLayerStyle;
} = {
    singlePoint: {
        circleColor: "green",
        circleOpacity: 0.84,
        circleStrokeWidth: 2,
        circleStrokeColor: "white",
        circleRadius: 5,
        circlePitchAlignment: "map",
    },

    clusteredPoints: {
        circlePitchAlignment: "map",

        circleColor: ["step", ["get", "point_count"], "#51bbd6", 100, "#f1f075", 750, "#f28cb1"],

        circleRadius: ["step", ["get", "point_count"], 20, 100, 30, 750, 40],

        circleOpacity: 0.84,
        circleStrokeWidth: 2,
        circleStrokeColor: "white",
    },

    clusterCount: {
        textField: [
            "format",
            ["concat", ["get", "point_count"], "\n"],
            {},
            ["concat", ">1: ", ["+", ["get", "mag2"], ["get", "mag3"], ["get", "mag4"], ["get", "mag5"]]],
            { "font-scale": 0.8 },
        ],
        textSize: 12,
        textPitchAlignment: "map",
    },
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
    const shapeSource = React.useRef<Mapbox.ShapeSource>(null);
    const [selectedCluster, setSelectedCluster] = React.useState<FeatureCollection>();

    return (
        <Mapbox.ShapeSource
            ref={shapeSource}
            id={"shape-source-id-0"}
            shape={data}
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
            onPress={async pressedShape => {
                if (shapeSource.current) {
                    try {
                        const [cluster] = pressedShape.features;

                        const collection = await shapeSource.current.getClusterLeaves(cluster, 999, 0);

                        setSelectedCluster(collection);
                    } catch {
                        if (!pressedShape.features[0].properties?.cluster) {
                            setSelectedCluster({
                                type: "FeatureCollection",
                                features: [pressedShape.features[0]],
                            });
                        }
                    }
                }
            }}
        >
            <Mapbox.SymbolLayer id="pointCount" style={layerStyles.clusterCount} />

            <Mapbox.CircleLayer
                id={"clusteredPoints"} //
                belowLayerID="pointCount"
                filter={["has", "point_count"]}
                style={layerStyles.clusteredPoints}
            />
            <Mapbox.CircleLayer //
                id="singlePoint"
                filter={["!", ["has", "point_count"]]}
                style={layerStyles.singlePoint}
            />
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
