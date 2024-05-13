const axios = require('axios');
const changesetParser = require("real-changesets-parser");
const fs = require('fs');
const readline = require('readline');

const config = require('./config');
const { containsInvalidCoordinate } = require('./utils');

/**
 * Processes an array of changesets asynchronously.
 * @param {string[]} changesets - An array of changeset IDs.
 * @param {string} date - The date in the format 'YYYY-MM-DD'.
 * @param {number} hour - The hour of the day (0-23).
 * @returns {void}
 */
async function processChangesets(changesets, date, hour) {
    // Array to store the file paths of the processed changesets
    const results = [];

    // Process changesets in batches of 10
    const batchSize = 100;
    for (let i = 0; i < changesets.length; i += batchSize) {
        const batch = changesets.slice(i, i + batchSize);
        await Promise.all(batch.map(async (changeset) => {
            // Process the changeset and get the result
            const result = await processChangeset(changeset);
            results.push(result);
        }));
    }

    // Combine the processed changesets into a single file
    combineResults(results, date, hour);
}

/**
 * Processes a single changeset and returns the file path of the processed changeset.
 * @param {string} changeset - The changeset ID.
 * @returns {Promise<string>} A promise that resolves to the file path of the processed changeset.
 */
async function processChangeset(changeset) {
    // Process the changeset asynchronously and return the result
    const url = `https://real-changesets.s3.amazonaws.com/${changeset}.json`;
    // console.log(`Processing changeset ${changeset}`);
    try {
        const response = await axios.get(url);
        const data = response.data;
        const geojson = changesetParser(data);
        // console.log(`geojson: ${JSON.stringify(geojson)}`);
        const features = geojson.features;

        if (features.length === 0) {
            console.log(`No features found in changeset ${changeset}`);
            return;
        }
        const filePath = `${config.DATA_PATH}/${changeset}_features.json`;

        await Promise.all(features.map(async (feature) => {
            if (feature !== null && feature !== undefined) {
                if (containsInvalidCoordinate(feature.geometry.coordinates)) {
                    console.log(`Dropping invalid feature ${feature.properties.id} in changeset ${changeset}`);
                    console.log(`Feature geometry containing invalid co-ordinates: ${JSON.stringify(feature.geometry)}`);
                    return;
                }
                const featureString = JSON.stringify(feature);
                
                await fs.appendFile(filePath, `${featureString}\n`, (error) => {
                    if (error) {
                        console.error(`Error writing feature to file: ${error}`);
                    }
                });
            } else {
                console.log(`undefined feature skipped in changeset ${changeset}`)
            }
        }));
        return filePath;
    } catch (error) {
        console.error(`Error processing changeset ${changeset}: ${error}`);
    }
}

/**
 * Combines the results of processed changesets into a single file.
 * @param {string[]} results - An array of file paths of processed changesets.
 * @param {string} date - The date in the format 'YYYY-MM-DD'.
 * @param {number} hour - The hour of the day (0-23).
 * @returns {void}
 */
async function combineResults(results, date, hour) {
    console.log(`Combining results from ${results.length} changesets`);
    const outputStream = fs.createWriteStream(`${config.DATA_PATH}/${date}T${hour}:00.geojson`);

    outputStream.write('{"type":"FeatureCollection","features":[');

    let divider = '';

    for (let i = 0; i < results.length; i++) {
        const filePath = results[i];
        if (!filePath) {
            continue;
        }
        const inputStream = fs.createReadStream(filePath);

        const rl = readline.createInterface({
            input: inputStream,
            output: process.stdout,
            terminal: false
        });

        rl.on('line', (line) => {
            outputStream.write(divider);
            divider = ',\n';
            outputStream.write(line);
        });

        await new Promise((resolve, reject) => {
            rl.on('close', () => {
                resolve();
            });

            rl.on('error', (error) => {
                console.error(`Error reading file: ${error}`);
            });
        });
    }

    outputStream.write(']}');
    outputStream.end();
    console.log(`Combined results written to ${outputStream.path}`);
}

module.exports = { processChangesets, processChangeset };