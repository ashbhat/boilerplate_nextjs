import React, { Component } from "react";
import styles from './styles.module.css';
import CsvUploader from './CsvUploader';
import ChartsView from './ChartsView';

export default class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {
            csvData: null
        };
    }

    handleCsvParsed = (parsedData) => {
        this.setState({ csvData: parsedData });
    };

    render() {
        const { csvData } = this.state;
        
        return (
            <div className={`${this.props.className} ${styles.contentContainer}`}>
                <CsvUploader onCsvParsed={this.handleCsvParsed} />
                {csvData && <ChartsView data={csvData} />}
            </div>
        );
    }
}
