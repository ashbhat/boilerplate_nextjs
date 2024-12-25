import React, { Component } from "react";
import styles from './styles.module.css';
// import { fetchReports } from "@/api/api";
import * as API from "@/api/api";
import Sidebar from "./1Sidebar";
import Content from "./2Content";
export default class Root extends Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {

    }

    render() {
        return(
            <div className={styles.main}>
                <Sidebar className={styles.sidebar} />
                <Content className={styles.content} />
            </div>
        )
    }
}
