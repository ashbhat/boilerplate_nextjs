import React, { Component } from "react";
import styles from './styles.module.css';
// import { fetchReports } from "@/api/api";
import * as API from "@/api/api";

export default class Root extends Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {

    }

    render() {
        return(
            <div>
                Home
            </div>
        )
    }
}