/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from "react";
import { StyleSheet, View } from "react-native";
import { FeatureCollection } from "geojson";
import _ from "lodash";
import data from "./data.json";

import Mapbox from "@rnmapbox/maps";

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
            ["concat", ">1: ", ["+", ["get", "count2"], ["get", "count3"], ["get", "count4"], ["get", "count5"]]],
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

const count1 = ["<", ["get", "predicted_count"], 2];
const count2 = ["all", [">=", ["get", "predicted_count"], 2], ["<", ["get", "predicted_count"], 3]];
const count3 = ["all", [">=", ["get", "predicted_count"], 3], ["<", ["get", "predicted_count"], 4]];
const count4 = ["all", [">=", ["get", "predicted_count"], 4], ["<", ["get", "predicted_count"], 5]];
const count5 = [">=", ["get", "predicted_count"], 5];

function Cluster() {
    const shapeSource = React.useRef<Mapbox.ShapeSource>(null);
    const [selectedCluster, setSelectedCluster] = React.useState<FeatureCollection>();

    const shape = {
        ...data,
        features: _.map(data.features, item => {
            const obj = { ...item, properties: { ...item.properties, predicted_count: item.properties.mag } };
            delete obj.properties.mag;

            return obj;
        }),
    };

    return (
        <Mapbox.ShapeSource
            ref={shapeSource}
            id={"shape-source-id-0"}
            shape={shape}
            cluster={true}
            clusterRadius={50}
            clusterMaxZoomLevel={14}
            clusterProperties={{
                count1: [
                    ["+", ["accumulated"], ["get", "count1"]],
                    ["case", count1, 1, 0],
                ],
                count2: [
                    ["+", ["accumulated"], ["get", "count2"]],
                    ["case", count2, 1, 0],
                ],
                count3: [
                    ["+", ["accumulated"], ["get", "count3"]],
                    ["case", count3, 1, 0],
                ],
                count4: [
                    ["+", ["accumulated"], ["get", "count4"]],
                    ["case", count4, 1, 0],
                ],
                count5: [
                    ["+", ["accumulated"], ["get", "count5"]],
                    ["case", count5, 1, 0],
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
                filter={["has", "point_count"]} // defined from mapbox
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
