/**
 * Created by doraoline on 12.02.17.
 */
import React from "react";

import ChatField from "./ChatField";
import ChatBox from "./ChatBox";
import FeedBackMenu from "./FeedBackMenu";

export default class Layout extends window.React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <h1> Testing </h1>
                <ChatField />
                <ChatBox />
                <FeedBackMenu />

            </div>
        );
    }
}